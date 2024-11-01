import console from 'node:console';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { sep as posixSep } from 'node:path/posix';
import { sep as winSep } from 'node:path/win32';
import process from 'node:process';
import { join, parse, relative, resolve } from 'pathe';
import ts from 'typescript';

const PRINTER = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
const WRITE_MODE = process.argv.includes('--write');
const CHECK_MODE = process.argv.includes('--check');
const VERSION_MODE = process.argv.includes('--version');
const PACKAGE_NAME = process.argv[2];
const PACKAGE_DIR = resolve(import.meta.dirname, `../../${PACKAGE_NAME}/src`);
const INDEX_PATH = join(PACKAGE_DIR, 'index.ts');
const JSDOC = `* The {@linkplain https://github.com/pulseflow/petal/blob/main/packages/${PACKAGE_NAME}#readme | @flowr/${PACKAGE_NAME}} version\n * that you are currently using`;

const isExported = (node: ts.Declaration): boolean => (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) > 0;
const isType = (node: ts.Node): boolean => [ts.SyntaxKind.InterfaceDeclaration, ts.SyntaxKind.TypeAliasDeclaration].includes(node.kind);

interface ModuleExportNodes {
	normal: ts.Declaration[];
	types: ts.Declaration[];
}

interface ModuleExportInclusions {
	useModule: boolean;
	useNormal: boolean;
	useTypes: boolean;
}

class ModuleFile {
	public readonly exports: ModuleExportNodes;
	public readonly isPrivate: boolean;
	public readonly exportInclusions: ModuleExportInclusions;
	public readonly path: ReturnType<typeof parse>;
	public readonly sourceFile: ts.SourceFile;

	public constructor(sourceFile: ts.SourceFile) {
		this.sourceFile = sourceFile;
		this.path = parse(sourceFile.fileName);
		this.isPrivate = this.path.name.startsWith('_');
		this.exports = this.parseExports();
		this.exportInclusions = this.deriveExportInclusions();
	}

	public generateExportSpecifiers(): ts.ExportSpecifier[] {
		return this.exports.types
			.concat(this.exportInclusions.useNormal ? this.exports.normal : [])
			.map(node => ts.getNameOfDeclaration(node)!.getText(this.sourceFile))
			.map(name => ts.factory.createExportSpecifier(false, undefined, name));
	}

	/**
	 * Rules:
	 * 1. If the module begins with `_`, ignore it
	 * 	- a) unless the module contains types, in which case those exclusively should be included
	 * 2. If the module exclusively contains types, use `export type *`, otherwise use `export *`
	 */
	public toExportDeclaration(packageDir: string): ts.ExportDeclaration | undefined {
		if (!this.exportInclusions.useModule)
			return;

		const relativePath = relative(packageDir, this.path.dir);
		const adjustedPath = (this.path.base === 'index.ts' ? relativePath : join(relativePath, this.path.name)).split(winSep).join(posixSep);
		const isTypeOnly = !this.exportInclusions.useNormal && this.exportInclusions.useTypes;
		const moduleSpecifier = ts.factory.createStringLiteral(`./${adjustedPath}.ts`, true);
		const exportSpecifier = this.isPrivate ? ts.factory.createNamedExports(this.generateExportSpecifiers()) : undefined;
		return ts.factory.createExportDeclaration(undefined, isTypeOnly, exportSpecifier, moduleSpecifier, undefined);
	}

	private deriveExportInclusions(): ModuleExportInclusions {
		const typesAvailable = this.exports.types.length > 0;

		return {
			useModule: !this.isPrivate || typesAvailable, // rule 1 & 1a
			useNormal: !this.isPrivate && this.exports.normal.length > 0,
			useTypes: typesAvailable,
		};
	}

	private parseExports(): ModuleExportNodes {
		const normal: ts.Declaration[] = [];
		const types: ts.Declaration[] = [];

		this.sourceFile.forEachChild((node) => {
			if (!ts.isDeclarationStatement(node) || !isExported(node))
				return;
			isType(node) ? types.push(node) : normal.push(node);
		});

		return { normal, types };
	}
}

function parseExternalExports(sourceFile: ts.SourceFile): ts.ExportDeclaration[] {
	const normal: ts.ExportDeclaration[] = [];
	sourceFile.forEachChild((node) => {
		if (!ts.isExportDeclaration(node))
			return;
		if (node.moduleSpecifier!.getText(sourceFile).includes('./'))
			return;
		normal.push(node);
	});

	return normal;
}

async function findIndexOrModules(dir: string, depth: number = 0): Promise<string[]> {
	const contents = await readdir(dir, { withFileTypes: true });
	let results: string[] = [];
	for (const item of contents) {
		if (item.name === 'common')
			continue;
		const itemPath = join(dir, item.name);
		if (item.isFile()) {
			if (!item.name.endsWith('.ts'))
				continue;
			if (item.name === 'index.ts') {
				if (depth === 0)
					continue;
				results = [itemPath];
				break;
			}
			results.push(itemPath);
		}
		else if (item.isDirectory() && !contents.find(entry => `${item.name}.ts` === entry.name)) {
			results = results.concat(await findIndexOrModules(itemPath, depth + 1));
		}
	}

	return results;
}

async function processVersion(): Promise<ts.VariableStatement> {
	const modifiers = [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)];
	const type = ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
	const initializer = ts.factory.createStringLiteral('[VI]{{inject}}[/VI]');
	const declarations = [ts.factory.createVariableDeclaration('version', undefined, type, initializer)];
	const declarationList = ts.factory.createVariableDeclarationList(declarations, ts.NodeFlags.Const);
	const versionVariable = ts.factory.createVariableStatement(modifiers, declarationList);
	return ts.addSyntheticLeadingComment(versionVariable, ts.SyntaxKind.MultiLineCommentTrivia, JSDOC, true);
}

async function processPackage(): Promise<string> {
	const indexPath = resolve(PACKAGE_DIR, './index.ts');
	const modules = await findIndexOrModules(PACKAGE_DIR);
	modules.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
	const indexProgram = ts.createProgram([indexPath].concat(modules), {});
	const indexExternalExports = parseExternalExports(indexProgram.getSourceFile(indexPath)!);
	const indexInternalExports = modules
		.map(moduleFile => new ModuleFile(indexProgram.getSourceFile(moduleFile)!).toExportDeclaration(PACKAGE_DIR))
		.filter(node => node) as ts.ExportDeclaration[];

	const list: Array<ts.ExportDeclaration | ts.VariableStatement> = indexExternalExports.concat(indexInternalExports);

	if (VERSION_MODE)
		list.push(await processVersion());

	return PRINTER.printList(ts.ListFormat.MultiLine, ts.factory.createNodeArray(list), indexProgram.getSourceFile(indexPath)!);
}

async function main() {
	const currentFile = await readFile(join(PACKAGE_DIR, 'index.ts'), { encoding: 'utf-8' });
	const index = await processPackage();

	if (CHECK_MODE && currentFile !== index) {
		console.error(`Index file for ${PACKAGE_NAME} is out of date.`);
		process.exit(1);
	}
	else if (WRITE_MODE) {
		return writeFile(INDEX_PATH, index);
	}

	if (VERSION_MODE)
		console.info(`✅ Adding version statement to \`./packages/${PACKAGE_NAME}/src/index.ts\``);

	return console.log(index);
}

void main();

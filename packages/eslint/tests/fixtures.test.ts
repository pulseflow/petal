import type { OptionsConfig, TypedFlatConfigItem } from '../src/types';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { execa } from 'execa';
import fg from 'fast-glob';
import fs from 'fs-extra';
import { join, resolve } from 'pathe';
import { afterAll, beforeAll, it } from 'vitest';

const fixturesDir = fileURLToPath(new URL('fixtures', import.meta.url));
const outputDir = fileURLToPath(new URL('_fixtures', import.meta.url));

beforeAll(async () => fs.rm(outputDir, { force: true, recursive: true }));
afterAll(async () => fs.rm(outputDir, { force: true, recursive: true }));

runWithConfig`js` ({
	typescript: false,
	vue: false,
});

runWithConfig`all` ({
	astro: true,
	svelte: true,
	typescript: true,
	unocss: false,
	vue: true,
});

runWithConfig`no-style` ({
	stylistic: false,
	typescript: true,
	unocss: false,
	vue: true,
});

runWithConfig`tab-double-quotes` (
	{
		stylistic: {
			indent: 'tab',
			quotes: 'double',
		},
		typescript: true,
		unocss: false,
		vue: true,
	},
	{
		rules: {
			'style/no-mixed-spaces-and-tabs': 'off',
		},
	},
);

runWithConfig`ts-override` (
	{
		typescript: true,
		unocss: false,
	},
	{
		rules: {
			'ts/consistent-type-definitions': ['error', 'type'],
		},
	},
);

runWithConfig`ts-strict` (
	{
		typescript: {
			tsconfigPath: './tsconfig.json',
		},
	},
	{
		rules: {
			'ts/no-unsafe-return': ['off'],
			'ts/strict-boolean-expressions': ['off'],
		},
	},
);

runWithConfig`ts-strict-with-react` (
	{
		typescript: {
			tsconfigPath: './tsconfig.json',
		},
		react: true,
	},
	{
		rules: {
			'ts/no-unsafe-return': ['off'],
		},
	},
);

runWithConfig`with-formatters` ({
	astro: true,
	formatters: true,
	typescript: true,
	unocss: false,
	vue: true,
});

runWithConfig`no-markdown-with-formatters` ({
	formatters: {
		markdown: true,
	},
	jsx: false,
	markdown: false,
	unocss: false,
	vue: false,
});

function runWithConfig(name: TemplateStringsArray) {
	return (configs: OptionsConfig = {}, ...items: TypedFlatConfigItem[]) => {
		it.concurrent(name[0], async ({ expect }) => {
			const from = resolve(fixturesDir, 'input');
			const output = resolve(fixturesDir, 'output', name[0]);
			const target = resolve(outputDir, name[0]);
			const configString = JSON.stringify(configs);
			const jsonString = JSON.stringify(items) as any ?? [];

			await fs.copy(from, target, { filter: src => !src.includes('node_modules') });
			await fs.writeFile(join(target, 'eslint.config.js'), `
// @eslint-disable
import { defineConfig } from '@flowr/eslint';

export default defineConfig(${configString}, ...${jsonString});
`, 'utf-8');

			if (process.platform === 'win32')
				await execa({ cwd: target, stdio: 'pipe' })`npx eslint --config ${target}\\eslint.config.js --fix`;
			else await execa({ cwd: target, stdio: 'pipe' })`pnpm -c dlx eslint --config ${target}/eslint.config.js . --fix`;

			const files = await fg('**/*', {
				cwd: target,
				ignore: [
					'node_modules',
					'tsconfig.json',
					'eslint.config.js',
					'eslint.config.ts',
				],
			});

			await Promise.all(files.map(async (f) => {
				const content = (await fs.readFile(join(target, f), 'utf-8')).replace(/\r\n/g, '\n').trim();
				const source = (await fs.readFile(join(from, f), 'utf-8')).replace(/\r\n/g, '\n').trim();
				const outputPath = join(output, f);

				if (content === source) {
					if (fs.existsSync(outputPath))
						await fs.remove(outputPath);
				}
				else {
					await expect.soft(content).toMatchFileSnapshot(outputPath);
				}
			}));
		}, 80_000);
	};
}

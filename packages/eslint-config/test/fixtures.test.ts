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

beforeAll(async () => await fs.rm(outputDir, { recursive: true, force: true }));
afterAll(async () => await fs.rm(outputDir, { recursive: true, force: true }));

runWithConfig`js` ({
	typescript: false,
	vue: false,
});

runWithConfig`all` ({
	typescript: true,
	vue: true,
	svelte: true,
	astro: true,
	unocss: false,
});

runWithConfig`no-style` ({
	typescript: true,
	vue: true,
	stylistic: false,
	unocss: false,
});

runWithConfig`tab-double-quotes` (
	{
		typescript: true,
		vue: true,
		stylistic: {
			indent: 'tab',
			quotes: 'double',
		},
		unocss: false,
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

runWithConfig`with-formatters` ({
	typescript: true,
	vue: true,
	astro: true,
	formatters: true,
	unocss: false,
});

runWithConfig`no-markdown-with-formatters` ({
	jsx: false,
	vue: false,
	markdown: false,
	unocss: false,
	formatters: {
		markdown: true,
	},
});

function runWithConfig(name: TemplateStringsArray) {
	return (configs: OptionsConfig = {}, ...items: TypedFlatConfigItem[]) => {
		it.concurrent(name[0], async ({ expect }) => {
			const from = resolve(fixturesDir, 'input');
			const output = resolve(fixturesDir, 'output', name[0]);
			const target = resolve(outputDir, name[0]);

			await fs.copy(from, target, { filter: src => !src.includes('node_modules') });
			await fs.writeFile(join(target, 'eslint.config.js'), `
// @eslint-disable
import { defineConfig } from '@flowr/eslint-config';

export default defineConfig(
	${JSON.stringify(configs)},
	...${JSON.stringify(items) ?? []},
);
`, 'utf-8');

			if (process.platform === 'win32')
				await execa({ stdio: 'pipe', cwd: target })`npx eslint . --config ${target}\\eslint.config.js --fix`;
			else await execa({ stdio: 'pipe', cwd: target })`pnpm -c dlx eslint --config ${target}/eslint.config.js . --fix`;

			const files = await fg('**/*', {
				ignore: [
					'node_modules',
					'tsconfig.json',
					'eslint.config.js',
					'eslint.config.ts',
				],
				cwd: target,
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

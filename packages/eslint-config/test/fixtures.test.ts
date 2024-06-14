import { join, resolve } from 'node:path';
import process from 'node:process';
import { afterAll, beforeAll, it } from 'vitest';
import fs from 'fs-extra';
import { execa } from 'execa';
import fg from 'fast-glob';
import type { OptionsConfig, TypedFlatConfigItem } from '../src/types';

beforeAll(async () => await fs.rm('./packages/eslint-config/_fixtures', { recursive: true, force: true }));
afterAll(async () => await fs.rm('./packages/eslint-config/_fixtures', { recursive: true, force: true }));

runWithConfig('js', {
	typescript: false,
	vue: false,
});

runWithConfig('all', {
	typescript: true,
	vue: true,
	svelte: true,
	astro: true,
	unocss: false,
});

runWithConfig('no-style', {
	typescript: true,
	vue: true,
	stylistic: false,
	unocss: false,
});

runWithConfig(
	'tab-double-quotes',
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

runWithConfig(
	'ts-override',
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

runWithConfig(
	'with-formatters',
	{
		typescript: true,
		vue: true,
		astro: true,
		formatters: true,
		unocss: false,
	},
);

runWithConfig(
	'no-markdown-with-formatters',
	{
		jsx: false,
		vue: false,
		markdown: false,
		unocss: false,
		formatters: {
			markdown: true,
		},
	},
);

function runWithConfig(name: string, configs: OptionsConfig, ...items: TypedFlatConfigItem[]) {
	it.concurrent(name, async ({ expect }) => {
		const from = resolve('./packages/eslint-config/fixtures/input');
		const output = resolve('./packages/eslint-config/fixtures/output', name);
		const target = resolve('./packages/eslint-config/_fixtures', name);

		await fs.copy(from, target, {
			filter: src => !src.includes('node_modules'),
		});
		await fs.writeFile(join(target, 'eslint.config.js'), `
// @eslint-disable
import petal from '@flowr/eslint-config';

export default petal(
	${JSON.stringify(configs)},
	...${JSON.stringify(items) ?? []},
);
`, 'utf-8');

		if (process.platform === 'win32')
			await execa({ stdio: 'pipe', cwd: target })`npx eslint . --fix`;
		else await execa({ stdio: 'pipe', cwd: target })`pnpm -c dlx eslint --config ./eslint.config.js . --fix`;

		const files = await fg('**/*', {
			ignore: [
				'node_modules',
				'eslint.config.js',
				'eslint.config.ts',
			],
			cwd: target,
		});

		await Promise.all(files.map(async (file) => {
			const content = (await fs.readFile(join(target, file), 'utf-8')).replace(/\r\n/g, '\n').trim();
			const source = (await fs.readFile(join(from, file), 'utf-8')).replace(/\r\n/g, '\n').trim();
			const outputPath = join(output, file);

			if (content === source) {
				if (fs.existsSync(outputPath))
					fs.remove(outputPath);
				return;
			}

			await expect.soft(content).toMatchFileSnapshot(outputPath);
		}));
	}, 60_000);
}

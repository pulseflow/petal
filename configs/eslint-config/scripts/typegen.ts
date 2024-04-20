import fs from 'node:fs/promises';
import { flatConfigsToRulesDTS } from 'eslint-typegen/core';
import { builtinRules } from 'eslint/use-at-your-own-risk';
import {
	astro,
	comments,
	imports,
	javascript,
	jsdoc,
	jsonc,
	markdown,
	node,
	perfectionist,
	react,
	solid,
	sortPackageJson,
	stylistic,
	svelte,
	test,
	toml,
	typescript,
	unicorn,
	unocss,
	vue,
	yaml,
} from '../src';
import { combine } from '../src/utils.js';

const configs = await combine(
	{
		plugins: {
			'': {
				rules: Object.fromEntries(builtinRules.entries()),
			},
		},
	},
	astro(),
	comments(),
	imports(),
	javascript(),
	solid(),
	jsdoc(),
	jsonc(),
	markdown(),
	node(),
	perfectionist(),
	react(),
	solid(),
	sortPackageJson(),
	stylistic(),
	svelte(),
	test(),
	toml(),
	typescript(),
	unicorn(),
	unocss(),
	vue(),
	yaml(),
);

const configNames = configs.map(c => c.name).filter(Boolean) as string[];
let dts = await flatConfigsToRulesDTS(configs, {
	includeAugmentation: false,
});

dts += `
// All configuration names
export type ConfigNames = ${configNames.map(i => `'${i}'`).join(' | ')}
`;

await fs.writeFile('src/typegen.d.ts', dts);

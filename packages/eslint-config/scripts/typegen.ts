import { writeFile } from 'node:fs/promises';
import { flatConfigsToRulesDTS } from 'eslint-typegen/core';
import { builtinRules } from 'eslint/use-at-your-own-risk';
import {
	astro,
	comments,
	formatters,
	imports,
	javascript,
	jsdoc,
	jsonc,
	jsx,
	markdown,
	node,
	perfectionist,
	query,
	react,
	regexp,
	schema,
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
} from '../src/index';
import { combine } from '../src/utils';

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
	formatters(),
	javascript(),
	jsx(),
	jsdoc(),
	jsonc(),
	markdown(),
	node(),
	perfectionist(),
	query(),
	react(),
	solid(),
	sortPackageJson(),
	stylistic(),
	svelte(),
	test(),
	toml(),
	schema(),
	regexp(),
	typescript(),
	unicorn(),
	unocss(),
	vue(),
	yaml(),
);

const ConfigNames = configs.map(c => c.name).filter(Boolean).map(i => `'${i}'`).join(' | ');
const rulesDTS = await flatConfigsToRulesDTS(configs, { includeAugmentation: false });

const configNames = `
// ----- petal/provider/configNames -----
export type ConfigNames = ${ConfigNames};
`;

await writeFile('src/types/typegen.d.ts', `${rulesDTS}\n${configNames}`);

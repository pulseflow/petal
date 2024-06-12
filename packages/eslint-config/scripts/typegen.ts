import fs from 'node:fs/promises';
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
	react,
	regexp,
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
	react(),
	solid(),
	sortPackageJson(),
	stylistic(),
	svelte(),
	test(),
	toml(),
	regexp(),
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
// ----- petal/provider/configNames -----
export type ConfigNames = ${configNames.map(i => `'${i}'`).join(' | ')};
`;

await fs.writeFile('src/typegen.d.ts', dts);

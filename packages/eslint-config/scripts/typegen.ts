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
	regexp(),
	typescript(),
	unicorn(),
	unocss(),
	vue(),
	yaml(),
);

const configNames = configs.map(c => c.name).filter(Boolean) as readonly string[];
const _dts = await flatConfigsToRulesDTS(configs, { includeAugmentation: false });

const dts = `${_dts}

// ----- petal/provider/configNames -----
export type ConfigNames = ${configNames.map(i => `'${i}'`).join(' | ')};
`;

await writeFile('src/types/typegen.d.ts', dts);

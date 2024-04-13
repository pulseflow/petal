import fs from 'node:fs/promises';
import { flatConfigsToRulesDTS } from 'eslint-typegen/core';
import { builtinRules } from 'eslint/use-at-your-own-risk';
import {
	astro,
	comments,
	imports,
	javascript,
	jest,
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
	jest(),
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

const dts = await flatConfigsToRulesDTS(configs, {
	includeAugmentation: false,
});

await fs.writeFile('src/typegen.d.ts', dts);

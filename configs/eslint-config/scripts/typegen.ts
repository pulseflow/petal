import fs from 'node:fs/promises';
import { flatConfigsToRulesDTS } from 'eslint-typegen/core';
import type { ESLint } from 'eslint';
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
	astro(),
	comments(),
	imports(),
	javascript(),
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
}); ;

await fs.writeFile('src/typegen.d.ts', dts);

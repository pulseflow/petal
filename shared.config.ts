import { defineConfig as defineTsupConfig } from 'tsup';
import { type BuildConfig, defineBuildConfig } from 'unbuild';
import { defineProject as defineVitestConfig } from 'vitest/config';

export const shared = {
	vitest: (name: TemplateStringsArray): { test: { globals: true; name: string } } =>
		defineVitestConfig({
			test: {
				globals: true,
				name: name[0],
			},
		}),
	build: (name: TemplateStringsArray) =>
		(config?: BuildConfig) =>
			defineBuildConfig({
				clean: true,
				declaration: true,
				name: name[0],
				...config,
			}),
	tsup: (name: TemplateStringsArray) =>
		defineTsupConfig({
			name: name[0],
		}),
};

export default shared;

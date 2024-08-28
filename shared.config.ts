import { defineConfig as defineTsupConfig } from 'tsup';
import { type BuildConfig as UnbuildConfig, defineBuildConfig as defineUnbuildConfig } from 'unbuild';
import { type UserWorkspaceConfig as VitestConfig, defineProject as defineVitestConfig } from 'vitest/config';

export const shared = {
	vitest: (name: TemplateStringsArray): VitestConfig =>
		defineVitestConfig({
			test: {
				globals: true,
				name: name[0],
			},
		}),
	build: (name: TemplateStringsArray) =>
		(config?: UnbuildConfig) =>
			defineUnbuildConfig({
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

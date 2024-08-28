import { defineConfig as defineTsupConfig } from 'tsup';
import { defineBuildConfig as defineUnbuildConfig, type BuildConfig as UnbuildConfig } from 'unbuild';
import { defineProject as defineVitestConfig, type UserWorkspaceConfig as VitestConfig } from 'vitest/config';

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

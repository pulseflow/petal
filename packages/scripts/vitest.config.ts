import type { ViteUserConfig } from 'vitest/config';
import { defineConfig } from 'vitest/config';

export function createVitestConfig(name: string | TemplateStringsArray, options: ViteUserConfig = {}): ViteUserConfig {
	return defineConfig({
		...options,
		esbuild: {
			...options.esbuild,
			target: (options.esbuild as import('vite').ESBuildOptions | undefined)?.target ?? 'esnext',
		},
		test: {
			...options.test,
			testTimeout: 60_000,
			passWithNoTests: true,
			coverage: {
				...options.test?.coverage,
				all: true,
				enabled: true,
				exclude: [
					...options.test?.coverage?.exclude ?? [],
					'**/node_modules/**',
					'**/dist/**',
					'**/*.{interface,type,d}.ts',
					'**/{interfaces,types}/*.ts',
					'**/index.{js,ts}',
					'**/exports/*.{js,ts}',
					'**/tests/**',
					'**/tsup.config.ts',
					'**/build.config.ts',
					'**/vitest.config.ts',
				],
				provider: 'v8',
				reporter: ['text', 'lcov'],
			},
			exclude: ['**/node_modules/**', '**/dist/**', '.idea', '.git', '.cache'],
			globals: true,
			name: name.toString(),
			typecheck: {
				checker: 'tsc',
				enabled: true,
				only: false,
			},
		},
	});
}

export default createVitestConfig`scripts`;

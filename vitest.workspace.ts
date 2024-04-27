import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
	'packages/create-petal/vitest.config.ts',
	'packages/eslint-config/vitest.config.ts',
	'packages/eslint-petal/vitest.config.ts',
	'packages/flowr-utils/vitest.config.ts',
]);

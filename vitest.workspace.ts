import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
	'packages/create-petal/vitest.config.ts',
	'packages/eslint-config/vitest.config.ts',
	'packages/eslint-plugin/vitest.config.ts',
	'packages/utils/vitest.config.ts',
]);

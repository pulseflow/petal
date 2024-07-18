import { defineProject } from 'vitest/config';

export default (name: TemplateStringsArray): { test: { globals: true; name: string } } =>
	defineProject({
		test: {
			globals: true,
			name: name[0],
		},
	});

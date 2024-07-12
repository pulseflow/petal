import { defineProject } from 'vitest/config';

export default (name: TemplateStringsArray) =>
	defineProject({
		test: {
			globals: true,
			name: name[0],
		},
	});

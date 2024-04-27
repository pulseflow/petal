import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
	entries: [
		'src/index',
		'src/core',
		'src/debug',
		'src/error',
		'src/inject',
		'src/req',
		'src/mixin',
	],
	declaration: true,
	clean: true,
});

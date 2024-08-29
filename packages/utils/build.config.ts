import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
	entries: [
		'src/index',
		'src/fetch',
		'src/debug',
		'src/error',
		'src/core',
	],
	declaration: true,
	clean: true,
	rollup: {
		emitCJS: true,
		dts: {
			respectExternal: true,
		},
		inlineDependencies: true,
	},
	externals: [],
});

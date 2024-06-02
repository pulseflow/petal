import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
	entries: [
		'src/index',
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

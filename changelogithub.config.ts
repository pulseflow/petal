import { defineConfig } from 'changelogithub';

export default defineConfig({
	scopeMap: {},
	types: {
		chore: { title: '🔨 Chores' },
		feature: { title: '✨ Features' },
		fix: { title: '🐞 Bug Fixes' },
		perf: { title: '🏎 Performance' },
		refactor: { title: '♻️ Refactors' },
		test: { title: '✅ Tests' },
		style: { title: '🎨 Stylistic' },
		doc: { title: '📝 Docs' },
		deps: { title: '📦 Dependencies' },
		deploy: { title: '🚀 Deployments' },
		wip: { title: '🚧 Experiments' },
	},
	titles: {
		breakingChanges: '🚨 Breaking Changes',
	},
	contributors: true,
	capitalize: true,
	group: true,
});

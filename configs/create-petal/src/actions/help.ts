import { printHelp } from '../messages.js';

export function help() {
	printHelp({
		commandName: 'create-petal',
		usage: '[dir] [...flags]',
		headline: 'scaffold petal projects',
		tables: {
			Flags: [
				['--help (-h)', 'See all available flags.'],
				['--template <name>', 'Specify your template.'],
				['--install / --no-install', 'Install dependencies (or not).'],
				['--git / --no-git', 'Initialize git repo (or not).'],
				['--yes (-y)', 'Skip all prompts by accepting defaults.'],
				['--no (-n)', 'Skip all prompts by declining defaults.'],
				['--dry-run', 'Walk through steps without executing.'],
				['--skip-flower', 'Skip Flower animation.'],
				['--ref', 'Choose petal branch (default: main).'],
				['--fancy', 'Enable full Unicode support for Windows.'],
				[
					'--typescript <option>',
					'TypeScript option: strict | esm | base | strictest.',
				],
			],
		},
	});
}

import type { PlopTypes } from '@turbo/gen';
import { parse as parseYAML, stringify as stringifyYAML } from 'yaml';

export interface LabelerData {
	color: string;
	name: string;
}

function sortYAMLObject(yaml: Record<string, string[]>): typeof yaml {
	const sortedYAML: typeof yaml = {};
	Object.keys(yaml)
		.sort((a, b) => a.localeCompare(b))
		.forEach((key) => {
			sortedYAML[key] = yaml[key];
		});

	return sortedYAML;
}

export default function generator(plop: PlopTypes.NodePlopAPI): void {
	plop.setGenerator('create-package', {
		description: 'Create a new Petal package.',
		prompts: [
			{
				type: 'input',
				name: 'name',
				message: 'The name of the new package.',
			},
			{
				type: 'input',
				name: 'description',
				message: 'The description of the new package.',
			},
		],
		actions: [
			{
				type: 'add',
				path: `${plop.getDestBasePath()}/../{{name}}/src/index.ts`,
				template: `console.log('Hello, from @flowr/{{name}}');`,
			},
			{
				type: 'add',
				path: `${plop.getDestBasePath()}/../{{name}}/tests/.gitkeep`,
			},
			{
				type: 'addMany',
				destination: `${plop.getDestBasePath()}/../{{name}}`,
				templateFiles: ['templates/**'],
				globOptions: { dot: true },
				base: 'templates/default/',
				stripExtensions: ['hbs'],
			},
			{
				type: 'modify',
				path: `${plop.getDestBasePath()}/../../.github/labels.yml`,
				transform: (content, answers) => {
					const labelsYAML = parseYAML(content) as LabelerData[];
					labelsYAML.push({ name: `packages:${answers.name}`, color: 'fbca04' });
					labelsYAML.sort((a, b) => a.name.localeCompare(b.name));

					return stringifyYAML(labelsYAML);
				},
			},
			{
				type: 'modify',
				path: `${plop.getDestBasePath()}/../../.github/labeler.yml`,
				transform: (content, answers) => {
					const labelerYAML = parseYAML(content) as Record<string, Array<Record<string, Array<Record<string, string[]>>>>>;

					labelerYAML[`packages:${answers.name}`] = [
						{
							'changed-files': [
								{ 'any-glob-to-any-file': [`packages/${answers.name}/*`, `packages/${answers.name}/**/*`] },
							],
						},
					];

					return stringifyYAML(labelerYAML, { sortMapEntries: true });
				},
			},
			{
				type: 'modify',
				path: `${plop.getDestBasePath()}/../../.github/issue-labeler.yml`,
				transform: (content, answers) => {
					const issueLabelerYAML = parseYAML(content) as Record<string, string[]>;
					issueLabelerYAML[`packages:${answers.name}`] = [
						`### Which (application|package|application or package) is this (bug report|feature request) for\\?\\n\\n${answers.name}\\n`,
					];

					return stringifyYAML(sortYAMLObject(issueLabelerYAML));
				},
			},
		],
	});
}

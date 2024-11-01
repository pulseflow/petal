import { createEslintRule } from '../utils.ts';

export const RULE_NAME = 'no-ts-export-equal';
export type MessageIds = 'noTsExportEqual';
export type Options = [];

export default createEslintRule<Options, MessageIds>({
	create: (context) => {
		const extension = context.filename.split('.').pop();
		if (!extension || !['cts', 'mts', 'ts', 'tsx'].includes(extension))
			return {};

		return { TSExportAssignment: node => context.report({ messageId: 'noTsExportEqual', node }) };
	},
	defaultOptions: [],
	meta: {
		docs: {
			description: 'Do not use `exports =`',
		},
		messages: {
			noTsExportEqual: 'Use ESM `export default` instead',
		},
		schema: [],
		type: 'problem',
	},
	name: RULE_NAME,
});

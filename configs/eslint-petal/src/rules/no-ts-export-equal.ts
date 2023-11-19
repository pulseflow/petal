import { createEslintRule } from '../utils.js';

export const RULE_NAME = 'no-ts-export-equal';
export type MessageIds = 'noTsExportEqual';
export type Options = [];

export default createEslintRule<Options, MessageIds>({
	name: RULE_NAME,
	meta: {
		type: 'problem',
		docs: {
			description: 'Do not use `exports =`',
			recommended: 'recommended',
		},
		schema: [],
		messages: {
			noTsExportEqual: 'Use ESM `export default` instead',
		},
	},
	defaultOptions: [],
	create: (context) => {
		const extension = context.filename.split('.').pop();
		if (!extension)
			return {};
		if (!['ts', 'tsx', 'mts', 'cts'].includes(extension))
			return {};

		return {
			TSExportAssignment(node) {
				context.report({
					node,
					messageId: 'noTsExportEqual',
				});
			},
		};
	},
});

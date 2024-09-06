import type { TSESTree } from '@typescript-eslint/utils';
import type { JSONSchema4 } from '@typescript-eslint/utils/json-schema';
import type { RuleFix, RuleFixer } from '@typescript-eslint/utils/ts-eslint';
import { createEslintRule } from '../utils';

export const RULE_NAME = 'consistent-chaining';
export type MessageIds = 'shouldWrap' | 'shouldNotWrap';
export type Options = [{
	allowFirstPropertyAccess?: boolean;
}];

const defaultOptions: Options = [{
	allowFirstPropertyAccess: true,
}];

export default createEslintRule<Options, MessageIds>({
	name: RULE_NAME,
	meta: {
		type: 'layout',
		docs: {
			description: 'Consistent line breaks for objects, arrays, and named import chaining.',
		},
		fixable: 'whitespace',
		schema: [{
			type: 'object',
			properties: {
				allowFirstPropertyAccess: {
					type: 'boolean',
					description: 'Allow first property access to be on the same line',
					default: defaultOptions[0].allowFirstPropertyAccess,
				},
			} satisfies Readonly<Record<keyof Options[0], JSONSchema4>>,
			additionalProperties: false,
		}],
		messages: {
			shouldWrap: 'Should have line breaks between items in node {{name}}',
			shouldNotWrap: 'Should not have line breaks between items in node {{name}}',
		},
	},
	defaultOptions,
	create: (context, [options = {}] = defaultOptions) => {
		const knownRoot = new WeakSet<TSESTree.Node>();

		return {
			MemberExpression: (node) => {
				const store: {
					root: TSESTree.Node;
					current: TSESTree.Node | undefined;
					mode: 'single' | 'multi' | null;
				} = { root: node, current: undefined, mode: null };

				while (store.root.parent && ['CallExpression', 'MemberExpression'].includes(store.root.parent.type))
					store.root = store.root.parent;

				if (knownRoot.has(store.root))
					return;

				knownRoot.add(store.root);
				const members: TSESTree.MemberExpression[] = [];
				store.current = store.root;

				while (store.current)
					switch (store.current.type) {
						case 'MemberExpression': {
							if (!store.current.computed)
								members.unshift(store.current);
							store.current = store.current.object;
							break;
						}
						case 'CallExpression': {
							store.current = store.current.callee;
							break;
						}
						default: {
							store.current = undefined;
							break;
						}
					}

				members.forEach((m, i) => {
					const token = context.sourceCode.getTokenBefore(m.property)!;
					const tokenBefore = context.sourceCode.getTokenBefore(token)!;
					const currentMode: 'single' | 'multi'
						= token.loc.start.line === tokenBefore.loc.end.line ? 'single' : 'multi';

					if (
						i === 0
						&& options.allowFirstPropertyAccess
						&& ['Identifier', 'ThisExpression'].includes(m.object.type)
						&& currentMode === 'single'
					)
						return;

					if (store.mode === null) {
						store.mode = currentMode;
						return;
					}

					const getFixer = (f: RuleFixer): RuleFix => {
						if (store.mode === 'multi')
							return f.insertTextAfter(tokenBefore, '\n');
						else
							return f.removeRange([tokenBefore.range[1], token.range[0]]);
					};

					if (store.mode !== currentMode)
						context.report({
							messageId: store.mode === 'single' ? 'shouldNotWrap' : 'shouldWrap',
							loc: token.loc,
							data: {
								name: store.root.type,
							},
							fix: getFixer,
						});
				});
			},
		};
	},
});

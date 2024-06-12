import type { RuleListener, RuleWithMeta, RuleWithMetaAndName } from '@typescript-eslint/utils/eslint-utils';
import type { RuleContext } from '@typescript-eslint/utils/ts-eslint';
import type { Rule } from 'eslint';
import { ESLintUtils } from '@typescript-eslint/utils';
import { builtinRules } from 'eslint/use-at-your-own-risk';

export interface RuleMap {
	'no-unused-vars': typeof import('eslint/lib/rules/no-unused-vars');
}

export type RuleId = keyof RuleMap;

export function getESLintCoreRule<R extends RuleId>(ruleId: R): RuleMap[R] {
	return ESLintUtils.nullThrows(builtinRules.get(ruleId), `ESLint core rule '${ruleId} not found.`);
}

const blobUrl = 'https://github.com/pulseflow/petal/blob/main/packages/eslint-plugin/src/rules/';

export interface RuleModule<T extends readonly unknown[]> extends Rule.RuleModule { defaultOptions: T };

/**
 * Creates reusable function to create rules with default options and docs URLs.
 *
 * @param urlCreator Creates a documentation URL for a given rule name.
 * @returns Function to create a rule with the docs URL format.
 */
function RuleCreator(urlCreator: (name: string) => string) {
	return <TOptions extends readonly unknown[], TMessageIds extends string>
	({ name, meta, ...rule }: Readonly<RuleWithMetaAndName<TOptions, TMessageIds>>): RuleModule<TOptions> =>
		createRule<TOptions, TMessageIds>({
			meta: {
				...meta,
				docs: {
					...meta.docs,
					url: urlCreator(name),
				},
			},
			...rule,
		});
}

/**
 * Creates a well-typed TSESLint custom ESLint rule without a docs URL.
 *
 * @returns Well-typed TSESLint custom ESLint rule.
 * @remarks It is generally better to provide a docs URL function to RuleCreator.
 */
function createRule<TOptions extends readonly unknown[], TMessageIds extends string>(
	{ create, defaultOptions, meta }: Readonly<RuleWithMeta<TOptions, TMessageIds>>,
): RuleModule<TOptions> {
	return {
		create: ((
			context: Readonly<RuleContext<TMessageIds, TOptions>>,
		): RuleListener => create(context, context.options.map(
			(o, i) => ({ ...defaultOptions[i] || {}, ...o || {} }),
		) as unknown as TOptions)) as any,
		defaultOptions,
		meta: meta as any,
	};
}

export const createEslintRule = RuleCreator(ruleName => `${blobUrl}${ruleName}.md`) as any as <TOptions extends readonly unknown[], TMessageIds extends string>
({ name, meta, ...rule }: Readonly<RuleWithMetaAndName<TOptions, TMessageIds>>) => RuleModule<TOptions>;

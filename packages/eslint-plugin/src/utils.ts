import type { RuleListener, RuleWithMeta, RuleWithMetaAndName, RuleModule as TSESModule } from '@typescript-eslint/utils/eslint-utils';
import type { RuleContext } from '@typescript-eslint/utils/ts-eslint';
import { builtinRules } from 'eslint/use-at-your-own-risk';

export interface RuleMap {
	'no-unused-vars': typeof import('eslint/lib/rules/no-unused-vars');
}

export type RuleId = keyof RuleMap;

function nullThrows<T>(value: T, message: string): NonNullable<T> {
	if (value == null)
		throw new Error(`Non-null Assertion Failed: ${message}`);
	return value;
}

export function getESLintCoreRule<R extends RuleId>(ruleId: R): RuleMap[R] {
	return nullThrows(builtinRules.get(ruleId), `ESLint core rule '${ruleId}' not found.`);
}

const blobUrl = 'https://github.com/pulseflow/petal/blob/main/packages/eslint-plugin/src/rules/';

export interface RuleModule<
	TOptions extends readonly unknown[],
	TMessageIds extends string,
> extends TSESModule<
		TMessageIds,
		TOptions
	> { defaultOptions: TOptions };

/**
 * Creates reusable function to create rules with default options and docs URLs.
 *
 * @param urlCreator Creates a documentation URL for a given rule name.
 * @returns Function to create a rule with the docs URL format.
 */
function RuleCreator(urlCreator: (name: string) => string): <
	TOptions extends readonly unknown[],
	TMessageIds extends string,
>({ name, meta, ...rule }: Readonly<RuleWithMetaAndName<TOptions, TMessageIds>>) => RuleModule<TOptions, TMessageIds> {
	return <TOptions extends readonly unknown[], TMessageIds extends string>
	({ name, meta, ...rule }: Readonly<RuleWithMetaAndName<TOptions, TMessageIds>>): RuleModule<TOptions, TMessageIds> =>
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
): RuleModule<TOptions, TMessageIds> {
	return {
		create: (
			context: Readonly<RuleContext<TMessageIds, TOptions>>,
		): RuleListener => create(context, context.options.map(
			(o, i) => ({ ...defaultOptions[i] || {}, ...o || {} }),
		) as unknown as TOptions),
		defaultOptions,
		meta,
	};
}

export const createEslintRule = RuleCreator(ruleName => `${blobUrl}${ruleName}.md`);

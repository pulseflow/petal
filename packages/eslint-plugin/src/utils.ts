import type { RuleListener, RuleWithMeta, RuleWithMetaAndName, RuleModule as TSESModule } from '@typescript-eslint/utils/eslint-utils';
import type { RuleContext } from '@typescript-eslint/utils/ts-eslint';

export const BLOB_URL = 'https://github.com/pulseflow/petal/blob/main/packages/eslint-plugin/src/rules/';

/**
 * An extension of TypeScript ESLint's {@link TSESModule | RuleModule} with default options.
 */
export interface RuleModule<
	TOptions extends readonly unknown[],
	TMessageIds extends string,
> extends TSESModule<
		TMessageIds,
		TOptions
	> { defaultOptions: TOptions };

/**
 * Creates reusable function to create {@link RuleModule | rules} with default options and docs URLs.
 *
 * @param urlCreator Creates a documentation URL for a given rule name.
 * @returns Function to create a rule with the docs URL format.
 */
function RuleCreator(urlCreator: (name: string) => string): <
	TOptions extends readonly unknown[],
	TMessageIds extends string,
>({ name, meta, ...rule }: Readonly<RuleWithMetaAndName<TOptions, TMessageIds>>
) => RuleModule<TOptions, TMessageIds> {
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
 * Creates a well-typed {@link RuleModule} custom ESLint rule without a docs URL.
 *
 * @returns A well-typed {@link RuleModule} custom ESLint rule.
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

/**
 * Create a well-typed {@link RuleModule} custom ESLint rule with documentation, options, and message ids.
 */
export const createEslintRule = RuleCreator(ruleName => `${BLOB_URL}${ruleName}.md`);

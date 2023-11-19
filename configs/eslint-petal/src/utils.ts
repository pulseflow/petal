import type { RuleListener, RuleWithMeta, RuleWithMetaAndName } from '@typescript-eslint/utils/eslint-utils';
import type { RuleContext } from '@typescript-eslint/utils/ts-eslint';
import type { Rule } from 'eslint';

const hasDocs: string[] = [

];

const blobUrl: string = 'https://github.com/pulseflow/petal/blob/main/configs/eslint-petal/src/rules';

export interface RuleModule<
	T extends readonly unknown[]
> extends Rule.RuleModule {
	defaultOptions: T;
};

/**
 * Creates reusable function to create rules with default options and docs URLs.
 *
 * @param urlCreator Creates a documentation URL for a given rule name.
 * @returns Function to create a rule with the docs URL format.
 */
const RuleCreator = (urlCreator: (ruleName: string) => string) =>
	<TOptions extends readonly unknown[], TMessageIds extends string>
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

/**
 * Creates a well-typed TSESLint custom ESLint rule without a docs URL.
 *
 * @returns Well-typed TSESLint custom ESLint rule.
 * @remarks It is generally better to provide a docs URL function to RuleCreator.
 */
const createRule = <TOptions extends readonly unknown[], TMessageIds extends string>
	({ create, defaultOptions, meta }: Readonly<RuleWithMeta<TOptions, TMessageIds>>): RuleModule<TOptions> => {
		return {
			create: ((
				context: Readonly<RuleContext<TMessageIds, TOptions>>
			): RuleListener => {
				const optionsWithDefault = context.options.map((opts, idx) => {
					return {
						...defaultOptions[idx] || {},
						...opts || {},
					};
				}) as unknown as TOptions;

				return create(context, optionsWithDefault);
			}) as any,
			defaultOptions,
			meta: meta as any,
		};
	};

export const createEslintRule = RuleCreator(
	ruleName => hasDocs.includes(ruleName)
		? `${blobUrl}/docs/${ruleName}.md`
		: `${blobUrl}${ruleName}.test.ts`,
) as any as <TOptions extends readonly unknown[], TMessageIds extends string>
	({ name, meta, ...rule }: Readonly<RuleWithMetaAndName<TOptions, TMessageIds>>) => RuleModule<TOptions>;

const warned = new Set<string>();
export const warnOnce = (message: string) => {
	if (warned.has(message)) return;
	warned.add(message);
	console.warn(message);
};

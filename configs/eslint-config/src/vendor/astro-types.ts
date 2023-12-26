import type { RuleConfig } from '@antfu/eslint-define-config';

export type AstroRules = NoConflictSetDirectivesRule &
	NoDeprecatedAstroCanonicalURLRule &
	NoDeprecatedAstroFetchContentRule &
	NoDeprecatedAstroResolveRule &
	NoDeprecatedGetEntryBySlugRule &
	NoUnusedDefineVarsInStyleRule &
	ValidCompileRule;

/**
 * Disallow conflicting set directives and child contents
 *
 * @see [no-conflict-set-directives](https://ota-meshi.github.io/eslint-plugin-astro/rules/no-conflict-set-directives/)
 */
type NoConflictSetDirectivesRuleConfig = RuleConfig<[]>;

/**
 * Disallow conflicting set directives and child contents
 *
 * @see [no-conflict-set-directives](https://ota-meshi.github.io/eslint-plugin-astro/rules/no-conflict-set-directives/)
 */
interface NoConflictSetDirectivesRule {
	/**
	 * Disallow conflicting set directives and child contents
	 *
	 * @see [no-conflict-set-directives](https://ota-meshi.github.io/eslint-plugin-astro/rules/no-conflict-set-directives/)
	 */
	'astro/no-conflict-set-directives': NoConflictSetDirectivesRuleConfig
}

/**
 * Disallow using deprecated `Astro.canonicalURL`
 *
 * @see [no-deprecated-astro-canonicalurl](https://ota-meshi.github.io/eslint-plugin-astro/rules/no-deprecated-astro-canonicalurl/)
 */
type NoDeprecatedAstroCanonicalURLRuleConfig = RuleConfig<[]>;

/**
 * Disallow using deprecated `Astro.canonicalURL`
 *
 * @see [no-deprecated-astro-canonicalurl](https://ota-meshi.github.io/eslint-plugin-astro/rules/no-deprecated-astro-canonicalurl/)
 */
interface NoDeprecatedAstroCanonicalURLRule {
	/**
	 * Disallow using deprecated `Astro.canonicalURL`
	 *
	 * @see [no-deprecated-astro-canonicalurl](https://ota-meshi.github.io/eslint-plugin-astro/rules/no-deprecated-astro-canonicalurl/)
	 */
	'astro/no-deprecated-astro-canonicalurl': NoDeprecatedAstroCanonicalURLRuleConfig
}

/**
 * Disallow using deprecated `Astro.fetchContent()`
 *
 * @see [no-deprecated-astro-fetchcontent](https://ota-meshi.github.io/eslint-plugin-astro/rules/no-deprecated-astro-fetchcontent/)
 */
type NoDeprecatedAstroFetchContentRuleConfig = RuleConfig<[]>;

/**
 * Disallow using deprecated `Astro.fetchContent()`
 *
 * @see [no-deprecated-astro-fetchcontent](https://ota-meshi.github.io/eslint-plugin-astro/rules/no-deprecated-astro-fetchcontent/)
 */
interface NoDeprecatedAstroFetchContentRule {
	/**
	 * Disallow using deprecated `Astro.fetchContent()`
	 *
	 * @see [no-deprecated-astro-fetchcontent](https://ota-meshi.github.io/eslint-plugin-astro/rules/no-deprecated-astro-fetchcontent/)
	 */
	'astro/no-deprecated-astro-fetchcontent': NoDeprecatedAstroFetchContentRuleConfig
}

/**
 * Disallow using deprecated Astro.resolve()
 *
 * @see [no-deprecated-astro-resolve](https://ota-meshi.github.io/eslint-plugin-astro/rules/no-deprecated-astro-resolve/)
 */
type NoDeprecatedAstroResolveRuleConfig = RuleConfig<[]>;

/**
 * Disallow using deprecated Astro.resolve()
 *
 * @see [no-deprecated-astro-resolve](https://ota-meshi.github.io/eslint-plugin-astro/rules/no-deprecated-astro-resolve/)
 */
interface NoDeprecatedAstroResolveRule {
	/**
	 * Disallow using deprecated Astro.resolve()
	 *
	 * @see [no-deprecated-astro-resolve](https://ota-meshi.github.io/eslint-plugin-astro/rules/no-deprecated-astro-resolve/)
	 */
	'astro/no-deprecated-astro-resolve': NoDeprecatedAstroResolveRuleConfig
}

/**
 * Disallow using deprecated `getEntryBySlug()`
 *
 * @see [no-deprecated-getentrybyslug](https://ota-meshi.github.io/eslint-plugin-astro/rules/no-deprecated-getentrybyslug/)
 */
type NoDeprecatedGetEntryBySlugRuleConfig = RuleConfig<[]>;

/**
 * Disallow using deprecated `getEntryBySlug()`
 *
 * @see [no-deprecated-getentrybyslug](https://ota-meshi.github.io/eslint-plugin-astro/rules/no-deprecated-getentrybyslug/)
 */
interface NoDeprecatedGetEntryBySlugRule {
	/**
	 * Disallow using deprecated `getEntryBySlug()`
	 *
	 * @see [no-deprecated-getentrybyslug](https://ota-meshi.github.io/eslint-plugin-astro/rules/no-deprecated-getentrybyslug/)
	 */
	'astro/no-deprecated-getentrybyslug': NoDeprecatedGetEntryBySlugRuleConfig
}

/**
 * Disallow unused `define:vars={...}` in the `style` tag
 *
 * @see [no-unused-define-vars-in-style](https://ota-meshi.github.io/eslint-plugin-astro/rules/no-unused-define-vars-in-style/)
 */
type NoUnusedDefineVarsInStyleRuleConfig = RuleConfig<[]>;

/**
 * Disallow unused `define:vars={...}` in the `style` tag
 *
 * @see [no-unused-define-vars-in-style](https://ota-meshi.github.io/eslint-plugin-astro/rules/no-unused-define-vars-in-style/)
 */
interface NoUnusedDefineVarsInStyleRule {
	/**
	 * Disallow unused `define:vars={...}` in the `style` tag
	 *
	 * @see [no-unused-define-vars-in-style](https://ota-meshi.github.io/eslint-plugin-astro/rules/no-unused-define-vars-in-style/)
	 */
	'astro/no-unused-define-vars-in-style': NoUnusedDefineVarsInStyleRuleConfig
}

/**
 * Disallow warnings when compiling
 *
 * @see [valid-compile](https://ota-meshi.github.io/eslint-plugin-astro/rules/valid-compile/)
 */
type ValidCompileRuleConfig = RuleConfig<[]>;

/**
 * Disallow warnings when compiling
 *
 * @see [valid-compile](https://ota-meshi.github.io/eslint-plugin-astro/rules/valid-compile/)
 */
interface ValidCompileRule {
	/**
	 * Disallow warnings when compiling
	 *
	 * @see [valid-compile](https://ota-meshi.github.io/eslint-plugin-astro/rules/valid-compile/)
	 */
	'astro/valid-compile': ValidCompileRuleConfig
}

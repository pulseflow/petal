declare module 'eslint/use-at-your-own-risk' {
	export { ESLint as LegacyESLint } from 'eslint';

	export const builtinRules: Map<string, import('eslint').Rule.RuleModule>;

	/**
	 * This class provides the functionality that enumerates every file which is
	 * matched by given glob patterns and that configuration.
	 * @deprecated
	 */
	export class FileEnumerator {
		/**
		 * Initialize this enumerator.
		 */
		constructor(params?: {
			cwd?: string
			configArrayFactory?: any
			extensions?: any
			globInputPaths?: boolean
			errorOnUnmatchedPattern?: boolean
			ignore?: boolean
		});
		isTargetPath(filePath: string, providedConfig?: any): boolean;
		iterateFiles(patternOrPatterns: string | string[]): IterableIterator<{
			config: any
			filePath: string
			ignored: boolean
		}>;
	}

	/**
	 * Returns whether flat config should be used.
	 * @returns Whether flat config should be used.
	 */
	export function shouldUseFlatConfig(): Promise<boolean>;

	/**
	 * Type for Options used in {@link FlatESLint}
	 */
	export interface FlatESLintOptions {
		/** Enable or disable inline configuration comments. */
		allowInlineConfig?: boolean
		/** Base config object, extended by all configs used with this instance */
		baseConfig?: import('eslint').ESLint.ConfigData
		/** Enable result caching. */
		cache?: boolean
		/** The cache file to use instead of .eslintcache. */
		cacheLocation?: string
		/** The strategy used to detect changed files. */
		cacheStrategy?: 'metadata' | 'content'
		/** The value to use for the current working directory. */
		cwd?: string
		/** If `false` then {@link FlatESLint#lintFiles} doesn't throw even if no target files found. Defaults to `true`. */
		errorOnUnmatchedPattern?: boolean
		/** Execute in autofix mode. If a function, should return a boolean. */
		fix?: boolean | Function
		/** Array of rule types to apply fixes for. */
		fixTypes?: string[]
		/** Set to false to skip glob resolution of input file paths to lint (default: true). If false, each input file paths is assumed to be a non-glob path to an existing file. */
		globInputPaths?: boolean
		/** False disables all ignore patterns except for the default ones. */
		ignore?: boolean
		/** Ignore file patterns to use in addition to config ignores. These patterns are relative to `cwd`. */
		ignorePatterns?: string[]
		/** Override config object, overrides all configs used with this instance */
		overrideConfig?: import('eslint').ESLint.ConfigData
		/**
		 * Searches for default config file when falsy;
		 * doesn't do any config file lookup when `true`; considered to be a config filename
		 * when a string.
		 */
		overrideConfigFile?: boolean | string
		/** An array of plugin implementations. */
		plugins?: Record<string, import('eslint').ESLint.Plugin>
		/** The severity to report unused eslint-disable directives. */
		reportUnusedDisableDirectives?: 'error' | 'warn' | 'off'
		/** Show warnings when the file list includes ignored files */
		warnIgnored?: boolean
	}

	/**
	 * Primary Node.js API for ESLint (flat)
	 */
	export class FlatESLint {
		/**
		 * Creates a new instance of the main ESLint API.
		 * @param options The options for this instance.
		 */
		constructor(options?: FlatESLintOptions);

		/**
		 * Get the version text from package.json
		 * @returns the version text
		 */
		static get version(): string;

		/**
		 * Outputs fixes from the given results to files.
		 * @param results The lint results.
		 * @returns Returns a promise that is used to track side effects.
		 */
		static outputFixes(
			results: import('eslint').ESLint.LintResult[],
		): Promise<void>;

		/**
		 * Returns results that only contain errors.
		 * @param results The results to filter.
		 * @returns The filtered results.
		 */
		static getErrorResults(
			results: import('eslint').ESLint.LintResult[],
		): import('eslint').ESLint.LintResult[];

		/**
		 * Returns meta objects for each rule represented in the lint results.
		 * @param results The results to fetch rules meta for.
		 * @returns A mapping of ruleIds to rule meta objects.
		 * @throws {TypeError} When the results object wasn't created from this ESLint instance.
		 * @throws {TypeError} When a plugin or rule is missing.
		 */
		getRulesMetaForResults(
			results: import('eslint').ESLint.LintResult[],
		): object;

		/**
		 * Executes the current configuration on an array of file and directory names.
		 * @param patterns An array of file and directory names.
		 * @returns The results of linting the file patterns given.
		 */
		lintFiles(
			patterns: string | string[],
		): Promise<import('eslint').ESLint.LintResult[]>;

		/**
		 * @param code A string of JavaScript code to lint.
		 * @param options The options.
		 * @param options.filePath The path to the file of the source code.
		 * @param options.warnIgnored When set to true, warn if given filePath is an ignored path.
		 * @returns The results of linting the string of code given.
		 */
		lintText(
			code: string,
			options: { filePath: string, warnIgnored: boolean },
		): Promise<import('eslint').ESLint.LintResult[]>;

		/**
		 * Returns the formatter representing the given formatter name.
		 * @param name The name of the formatter to load.
		 * The following values are allowed:
		 * - `undefined` ... Load `stylish` builtin formatter.
		 * - A builtin formatter name ... Load the builtin formatter.
		 * - A third-party formatter name:
		 *   - `foo` → `eslint-formatter-foo`
		 *   - `@foo` → `@foo/eslint-formatter`
		 *   - `@foo/bar` → `@foo/eslint-formatter-bar`
		 * - A file path ... Load the file.
		 * @returns A promise resolving to the formatter object.
		 * This promise will be rejected if the given formatter was not found or not
		 * a function.
		 */
		loadFormatter(name: string): Promise<import('eslint').ESLint.Formatter>;

		/**
		 * Returns a configuration object for the given file based on the CLI options.
		 * This is the same logic used by the ESLint CLI executable to determine
		 * configuration for each file it processes.
		 * @param filePath The path of the file to retrieve a config object for.
		 * @returns A configuration object for the file
		 *      or `undefined` if there is no configuration data for the object.
		 */
		calculateConfigForFile(
			filePath: string,
		): Promise<import('eslint').ESLint.ConfigData | undefined>;

		/**
		 * Finds the config file being used by this instance based on the options
		 * passed to the constructor.
		 * @returns The path to the config file being used or
		 *      `undefined` if no config file is being used.
		 */
		findConfigFile(): Promise<string | undefined>;

		/**
		 * Checks if a given path is ignored by ESLint.
		 * @param filePath The path of the file to check.
		 * @returns Whether or not the given path is ignored.
		 */
		isPathIgnored(filePath: string): Promise<boolean>;
	}
}

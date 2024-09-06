export const GLOB_SRC_EXT = '?([cm])[jt]s?(x)';
export const GLOB_SRC = '**/*.?([cm])[jt]s?(x)';

export const GLOB_JS = '**/*.?([cm])js';
export const GLOB_CJS = '**/*.?(c)js';
export const GLOB_JSX = '**/*.?([cm])jsx';

export const GLOB_TS = '**/*.?([cm])ts';
export const GLOB_TSX = '**/*.?([cm])tsx';
export const GLOB_DTS = '**/*.d.?([cm])ts';
export const GLOB_TEST_TS = '**/*.{test,spec}.ts?(x)';

export const GLOB_STYLE = '**/*.{c,le,sc}ss';
export const GLOB_CSS = '**/*.css';
export const GLOB_POSTCSS = '**/*.{p,post}css';
export const GLOB_LESS = '**/*.less';
export const GLOB_SCSS = '**/*.scss';

export const GLOB_JSON = '**/*.json';
export const GLOB_JSON5 = '**/*.json5';
export const GLOB_JSONC = '**/*.jsonc';

export const GLOB_PACKAGE_JSON = '**/package.json';
export const GLOB_TSCONFIGS = ['**/tsconfig.json', '**/tsconfig.*.json'];

export const GLOB_MARKDOWN = '**/*.md';
export const GLOB_MARKDOWN_IN_MARKDOWN = '**/*.md/*.md';
export const GLOB_MARKDOWN_CODE = `${GLOB_MARKDOWN}/${GLOB_SRC}`;
export const GLOB_SVELTE = '**/*.svelte';
export const GLOB_VUE = '**/*.vue';
export const GLOB_ASTRO = '**/*.astro';
export const GLOB_ASTRO_TS = '**/*.astro/*.ts';
export const GLOB_GRAPHQL = '**/*.{g,graph}ql';
export const GLOB_YAML = '**/*.y?(a)ml';
export const GLOB_TOML = '**/*.toml';
export const GLOB_XML = '**/*.xml';
export const GLOB_SVG = '**/*.svg';
export const GLOB_HTML = '**/*.htm?(l)';
export const GLOB_BIN = '**/bin/**/*';
export const GLOB_BIN_SRC = `**/bin.${GLOB_SRC_EXT}`;
export const GLOB_SCRIPTS = `**/scripts/${GLOB_SRC}`;
export const GLOB_CLI = `cli/${GLOB_SRC}`;
export const GLOB_CLI_SRC = `cli.${GLOB_SRC_EXT}`;

// @keep-sorted
export const GLOB_UNIT_TESTS = [
	`**/__tests__/**/*.${GLOB_SRC_EXT}`,
	`**/*.test.${GLOB_SRC_EXT}`,
];

// @keep-sorted
export const GLOB_BENCH_TESTS = [
	`**/*.bench.${GLOB_SRC_EXT}`,
	`**/*.benchmark.${GLOB_SRC_EXT}`,
];

export const GLOB_E2E_TEST = `**/*.spec.${GLOB_SRC_EXT}`;

// @keep-sorted
export const GLOB_TESTS: string[] = [
	...GLOB_UNIT_TESTS,
	...GLOB_BENCH_TESTS,
	GLOB_E2E_TEST,
];

// @keep-sorted
export const GLOB_ALL_SRC: string[] = [
	GLOB_HTML,
	GLOB_JSON,
	GLOB_JSON5,
	GLOB_MARKDOWN,
	GLOB_SRC,
	GLOB_STYLE,
	GLOB_SVELTE,
	GLOB_VUE,
	GLOB_XML,
	GLOB_YAML,
];

export const GLOB_EXCLUDE: string[] = [
	'**/node_modules',
	'**/dist',
	'**/package-lock.json',
	'**/yarn.lock',
	'**/pnpm-lock.yaml',
	'**/bun.lockb',

	'**/output',
	'**/coverage',
	'**/temp',
	'**/.temp',
	'**/tmp',
	'**/.tmp',
	'**/.history',
	'**/.vitepress/cache',
	'**/.nuxt',
	'**/.next',
	'**/.svelte-kit',
	'**/.vercel',
	'**/.changeset',
	'**/.idea',
	'**/.cache',
	'**/.output',
	'**/.vite-inspect',
	'**/.yarn',
	'**/.astro',
	'**/vite.config.*.timestamp-*',

	'**/Cargo.lock',
	'**/target',

	'**/CHANGELOG*.md',
	'**/*.min.*',
	'**/LICENSE*',
	'**/__snapshots__',
	'**/auto-import?(s).d.ts',
	'**/components.d.ts',
];

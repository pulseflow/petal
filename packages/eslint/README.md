# @flowr/eslint

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

- easy reasonable defaults with just one line of config
- auto fix for formatting and best practices (**without** prettier)
- designed to work with typescript, jsx, json, yaml, toml, markdown, etc. out of the box
- optional [react](#react), [unocss](#unocss), [solid](#solid), [astro](#astro), [vue](#vue) and [svelte](#svelte) support
- optional [formatter](#formatters) support for css, html, xml, graphql, etc.
- easily composable [eslint flat config]
- respects `.gitignore` by default, without the need for `.eslintignore`
- **petal specification**: minimal, stable, consistent code and diffs
  - sorted imports, dangling commas
  - single quotes, semicolons
  - uses eslint [stylistic]
- supports `eslint` v9.5+

## usage

### installation

```bash
pnpm i -D eslint @flowr/eslint
```

### create config file

```js
// eslint.config.mjs
import { defineConfig } from '@flowr/eslint';

export default defineConfig();
```

<details>
<summary>
combined with a legacy configuration:
</summary>

if you still use some configuration from the legacy eslintrc format, you can use the [`@eslint/eslintrc`](https://www.npmjs.com/package/@eslint/eslintrc) package to convert them to the flat config.

```js
// eslint.config.mjs
import { FlatCompat } from '@eslint/eslintrc';
import { defineConfig } from '@flowr/eslint';

const compat = new FlatCompat();

export default defineConfig(
	{
		ignores: [],
	},

	// legacy config
	...compat.config({
		extends: [
			'eslint:recommended'
			// other legacy config options...
		]
	})

	// other flat configs...
);
```

> note that `.eslintignore` no longer works in flat config, see [customization](#customization) for more details.
</details>

### lint script

```json
{
	"scripts": {
		"lint": "eslint",
		"lint:fix": "eslint --fix"
	}
}
```

## ide integration

<details>
<summary>🟦 vscode support</summary>

<br>

install the [vscode eslint extension] and add the following settings to your `.vscode/settings.json`:

```jsonc
{
	// disable the default formatter, use eslint
	"prettier.enable": false,
	"editor.formatOnSave": false,

	// automatically fix
	"editor.codeActionsOnSave": {
		"source.fixAll.eslint": "explicit",
		"source.organizeImports": "never"
	},

	// silent stylistic rules in the ide, but still fix them
	"eslint.rules.customizations": [
		{ "rule": "style/*", "severity": "off", "fixable": true },
		{ "rule": "*-indent", "severity": "off", "fixable": true },
		{ "rule": "*-spacing", "severity": "off", "fixable": true },
		{ "rule": "*-spaces", "severity": "off", "fixable": true },
		{ "rule": "*-order", "severity": "off", "fixable": true },
		{ "rule": "*-dangle", "severity": "off", "fixable": true },
		{ "rule": "*-newline", "severity": "off", "fixable": true },
		{ "rule": "*quotes", "severity": "off", "fixable": true },
		{ "rule": "*semi", "severity": "off", "fixable": true }
	],

	// enable eslint for all supported languages
	"eslint.validate": [
		"javascript",
		"javascriptreact",
		"typescript",
		"typescriptreact",
		"vue",
		"html",
		"markdown",
		"json",
		"json5",
		"jsonc",
		"yaml",
		"astro",
		"toml",
		"graphql",
		"gql",
		"xml",
		"css",
		"less",
		"scss",
		"pcss",
		"postcss"
	]
}
```

</details>

<details>
<summary>🟩 neovim support</summary>

<br>

```lua
local customizations = {
    { rule = 'style/*', severity = 'off', fixable = true },
    { rule = 'format/*', severity = 'off', fixable = true },
    { rule = '*-indent', severity = 'off', fixable = true },
    { rule = '*-spacing', severity = 'off', fixable = true },
    { rule = '*-spaces', severity = 'off', fixable = true },
    { rule = '*-order', severity = 'off', fixable = true },
    { rule = '*-dangle', severity = 'off', fixable = true },
    { rule = '*-newline', severity = 'off', fixable = true },
    { rule = '*quotes', severity = 'off', fixable = true },
    { rule = '*semi', severity = 'off', fixable = true },
}

local lspconfig = require('lspconfig')
-- enable eslint for all supported languages
lspconfig.eslint.setup({
    filetypes = {
        "javascript",
        "javascriptreact",
        "javascript.jsx",
        "typescript",
        "typescriptreact",
        "typescript.tsx",
        "vue",
        "html",
        "markdown",
        "json",
        "jsonc",
        "json5",
        "yaml",
        "toml",
        "xml",
        "gql",
        "graphql",
        "astro",
        "svelte",
        "css",
        "less",
        "scss",
        "pcss",
        "postcss"
    },
    settings = {
        -- silence the stylistic rules in neovim, but still autofix them
        rulesCustomizations = customizations,
    },
    -- nvim-lspconfig has an EslintFixAll command predefined. you can create an `autocmd` to call this command upon saving a file
    on_attach = function(client, bufnr)
        vim.api.nvim_create_autocmd("BufWritePre", {
            buffer = bufnr,
            command = "EslintFixAll",
        })
    end,
})
```

there are some preexisting libraries for eslint nvim support as well, which you can use for auto-fixing too:

- use [`conform.nvim`](https://github.com/stevearc/conform.nvim)
- use [`none-ls.nvim`](https://github.com/nvimtools/none-ls.nvim)
- use [`nvim-lint`](https://github.com/mfussenegger/nvim-lint)

</details>

## customization

we use [eslint flat config]. it provides much better orginzation and composition. normally you only need to import and use the `petal` preset:

```js
// eslint.config.js
import { defineConfig } from '@flowr/eslint';

export default defineConfig();
```

alternatively, you can confgure each integration individually, for example:

```js
// eslint.config.js
import { defineConfig } from '@flowr/eslint';

export default defineConfig({
	// type of the project
	type: 'lib', // 'lib' or 'app', default is 'app'

	// enable stylistic formatting rules
	stylistic: {
		indent: 'tab', // 4, or 2
		quotes: 'single', // or 'double'
	},

	// frameworks are automatically detected. you can manually enable them:
	typescript: true,
	astro: true,
	vue: true,

	// disable jsonc and yaml support
	jsonc: false,
	yaml: false,

	// `.eslintignore` isn't supported in flat configs, use `ignores` instead
	ignores: [
		'**/fixtures',
		// ...globs
	],
	// ...
});
```

the `defineConfig` factory function also accepts any number of arbitrary custom config overrides:

```js
// eslint.config.js
import { defineConfig } from '@flowr/eslint';

export default defineConfig(
	{
		// configures for `petal` preset
	},

	// eslint flat config overrides
	{
		files: ['**/*.ts'],
		rules: {
			'do-something': 'error',
		},
	},
	{
		rules: {
			'do-something': 'off',
		},
	},
);
```

going more advanced, you can also import fine-grained configs and compose them as wanted:

<details>
<summary>advanced example</summary>

we wouldn't recommend using this style in general unless you know what you are doing, as there are shared options between configs and might need extra care to make consistent:

```js
// eslint.config.js
import {
	combine,
	comments,
	ignores,
	imports,
	javascript,
	jsdoc,
	jsonc,
	markdown,
	node,
	sortPackageJson,
	sortTsconfig,
	stylistic,
	toml,
	typescript,
	unicorn,
	vue,
	yaml,
} from '@flowr/eslint';

export default combine(
	ignores(),
	javascript(/* options */),
	comments(),
	node(),
	jsdoc(),
	imports(),
	unicorn(),
	typescript(/* options */),
	stylistic(),
	vue(),
	jsonc(),
	yaml(),
	toml(),
	markdown(),
	/* ... */
);
```

</details>

check out the [configs] and [factory] for more details.

### plugins remaining

since [eslint flat config] allows us to explicitly provide the plugin names (rather than the mandatory convention derived from the npm package name), we renamed some plugins to make the overall scope more consistent and easier to write:

| New Prefix   | Original Prefix         | Source Plugin                           |
| ------------ | ----------------------- | --------------------------------------- |
| `import/*`   | `i/*`                   | [`eslint-plugin-import-x`]              |
| `node/*`     | `n/*`                   | [`eslint-plugin-n`]                     |
| `yaml/*`     | `yml/*`                 | [`eslint-plugin-yml`]                   |
| `ts/*`       | `@typescript-eslint/*`  | [`@typescript-eslint/eslint-plugin`]    |
| `style/*`    | `@stylistic/*`          | [`@stylistic/eslint-plugin`]            |
| `test/*`     | `vitest/*`              | [`@vitest/eslint-plugin`]               |
| `vue-a11y/*` | `vuejs-accessibility/*` | [`eslint-plugin-vuejs-accessibility`]   |
| `schema/*`   | `json-schema-validator` | [`eslint-plugin-json-schema-validator`] |

when you want to override rules, or disable them inline, you need to update to the new prefix (unfortunately the vscode eslint extension doesn't automatically rewrite this):

```diff
-// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
+// eslint-disable-next-line ts/consistent-type-definitions
type foo = { bar: 2 }
```

<details>
<summary>change back to original prefixes/change other prefixes</summary>

if you really want to use the original prefix, you can revert the plugin renaming using:

```ts
// eslint.config.js
import { defineConfig } from '@flowr/eslint';

export default defineConfig()
	.renamePlugins({
		node: 'n',
		ts: '@typescript-eslint',
		yaml: 'yml',
		// ...
	});
```
</details>

### rules overrides

certain rules would only be enabled in specific files, for example `ts/*` rules would only be enabled in `.ts` files. if you want to override those rules, you need to specifiy the file extension:

```js
// eslint.config.js
import { defineConfig } from '@flowr/eslint';

export default defineConfig(
	{
		vue: true,
		typescript: true
	},
	{
		// remember to specify the file glob here, otherwise the vue plugin might apply to non-vue files
		files: ['**/*.vue'],
		rules: {
			'vue/operator-linebreak': ['error', 'before'],
		},
	},
	{
		// without the file globs, they are general rules for all files
		rules: {
			'style/semi': ['error', 'never'],
		},
	},
);
```

we also provide the `overrides` option for each integration to use our default globs:

```js
// eslint.config.js
import { defineConfig } from '@flowr/eslint';

export default defineConfig({
	vue: {
		overrides: {
			'vue/operator-linebreak': ['error', 'before'],
		}
	},
	typescript: {
		overrides: {
			'ts/consistent-type-definitions': ['error', 'interface'],
		}
	},
	yaml: {
		overrides: {
			/* ... */
		}
	},
});
```

### composer

the factory function `defineConfig()` returns a [`FlatConfigComposer` object from `eslint-flat-config-utils`](https://github.com/antfu/eslint-flat-config-utils#composer) where you can chain the methods to compose the config even more flexibly.

```js
// eslint.config.ks
import { defineConfig } from '@flowr/eslint';

export default defineConfig()
	.prepend(
		// some configs before the main config
	)
	.override(
		'petal/typescript',
		{
			rules: {
				'import/order': ['error', { 'newlines-between': 'always' }],
			}
		}
	)
	.renamePlugins({
		'old-prefix': 'new-prefix',
		/* ... */
	});
/* ... */
```

### optional configs

we provide some additional configs for specific cases, that we don't include their dependencies by default to reduce package size:

#### vue

vue support is auto-detected based on the `vue` dependency. you can also explicitly enable or disable it:

```js
// eslint.config.js
import { defineConfig } from '@flowr/eslint';

export default defineConfig({
	vue: true,
});
```

we also support additional options, such as `accessibility` for a11y rules, and `sfcBlocks` for inline code blocks:

```js
// eslint.config.js
import { defineConfig } from '@flowr/eslint';

export default defineConfig({
	vue: {
		sfcBlocks: true, // default is `true`, requires `eslint-processor-vue-blocks`
		accessibility: true, // default is `false`, requires `eslint-plugin-vuejs-accessibility`
	},
});
```

the required dev dependencies are: `eslint-plugin-vue` (you should be prompted to install these when running eslint)

if you have `vue.sfcBlocks` enabled (set to enabled by default), you will also need to install `eslint-processor-vue-blocks` as a dev dependency, also prompted upon running eslint

if you have `vue.accessibility` enabled (set to disabled by default), you will also need to install `eslint-plugin-vuejs-accessibility` as a dev dependency, also prompted upon running eslint

#### vue 2

we have limited support for vue 2 (as it's already [reached eol](https://v2.vuejs.org/eol/)). if you are still using vue 2, you can set it manually by setting `vueVersion` to `2`.

```js
// eslint.config.js
import { defineConfig } from '@flowr/eslint';

export default defineConfig({
	vue: {
		vueVersion: 2,
	},
});
```

this support may be removed when `eslint-plugin-vue` drops support for vue 2 and it is recommended to update to vue 3 if possible.

#### formatters

use external formatters to format files that eslint cannot handle yet (`.css`, `.html`, etc.)

```js
// eslint.config.js
import { defineConfig } from '@flowr/eslint';

export default defineConfig({
	formatters: {
		css: true, // format CSS, LESS, SCSS files, also the `<style>` blocks in vue, uses prettier by default
		html: true, // format HTML files, uses prettier by default
		markdown: 'prettier', // format Markdown files, uses prettier by default supports also 'dprint' or `true` (default)
	},
	/* ... */
});
```

the required dev dependencies are: `eslint-plugin-format` (you should be prompted to install these when running eslint)

#### react

to enable react support, you need to explicitly turn it on:

```js
// eslint.config.js
import { defineConfig } from '@flowr/eslint';

export default defineConfig({
	react: true,
});
```

the required dev dependencies are: `@eslint-react/eslint-plugin eslint-plugin-react-hooks` (you should be prompted to install these when running eslint)

if you have `react.accessibility` enabled (set to disabled by default), you will also need to install `eslint-plugin-jsx-a11y` as a dev dependency, also prompted upon running eslint

#### astro

to enable astro support, you need to explicitly turn it on or install the `astro` dependency, in which case it is auto-detected:

```js
// eslint.config.js
import { defineConfig } from '@flowr/eslint';

export default defineConfig({
	astro: true,
});
```

the required dev dependencies are: `eslint-plugin-astro` (you should be prompted to install these when running eslint)

if you have `astro.accessibility` enabled (set to disabled by default), you will also need to install `eslint-plugin-jsx-a11y` as a dev dependency, also prompted upon running eslint

#### svelte

to enable svelte support, you need to explicitly turn it on, or install a svelte related dependency, in which case it is auto-detected:

```js
// eslint.config.js
import { defineConfig } from '@flowr/eslint';

export default defineConfig({
	svelte: true,
});
```

the required dev dependencies are: `eslint-plugin-svelte` (you should be prompted to install these when running eslint)

#### unocss

to enable unocss support, you need to explicitly turn it on:

```js
// eslint.config.js
import { defineConfig } from '@flowr/eslint';

export default defineConfig({
	unocss: true,
});
```

the required dev dependencies are: `@unocss/eslint-plugin` (you should be prompted to install these when running eslint)

#### solid

to enable solid support, you need to explicitly turn it on, or install a solid-related dependency, in which case it is auto-detected:

```js
// eslint.config.js
import { defineConfig } from '@flowr/eslint';

export default defineConfig({
	solid: true,
});
```

the required dev dependencies are: `eslint-plugin-solid` (you should be prompted to install these when running eslint)

if you have `react.accessibility` enabled (set to disabled by default), you will also need to install `eslint-plugin-jsx-a11y` as a dev dependency, also prompted upon running eslint

### optional rules

we also provide some optional plugins and rules for extended/stricter usage:

#### `command`

the plugin [`eslint-plugin-command`] allows you to add on-demand micro codemods that trigger on specific comment commands:

- `// to-function` - converts an arrow function to a normal function
- `// to-arrow` - converts a normal function to an arrow function
- `// to-for-each` - converts a for-in/for-of loop to `.forEach()`
- `// to-for-of` - converts `.forEach()` to a for-in/for-of loop
- `// keep-sorted` - sorts an object/array/interface
- ... etc. - refer to the [docs](https://eslint-plugin-command.antfu.me/guide/#built-in-commands)

you can add the trigger comment one line above the code you want to transform (note the triple slash):

<!-- eslint-skip -->
```ts
// to-function
const foo = async (bar: string): void => {
    console.log(bar);
};
```

will be transformed into the following upon saving or running `eslint --fix`:

```ts
async function foo(bar: string): void {
	console.log(bar);
}
```

the command comments are one-off and removed with the codemod transformation.

### type aware rules

configuration for [type aware rules] can be enabled by passing the options object to the `typescript` configuration:

```js
// eslint.config.js
import { defineConfig } from '@flowr/eslint';

export default defineConfig({
	typescript: {
		tsconfigPath: 'tsconfig.json',
	},
});
```

### editor specific disables

auto-fixing for the following rules are disabled when [eslitn is running in a code editor](#ide-integration):

- [`prefer-const`]
- [`unused-imports/no-unused-imports`]
- [`petal/no-only-tests`]

this is to prevent unused imports and temporary patches from getting removed by the editor during refactoring. those rules are applied when eslint is ran in the terminal. you can disable this behavior by manually setting `isInEditor`:

```js
// eslint.config.js
import { defineConfig } from '@flowr/eslint';

export default defineConfig({
	isInEditor: false,
});
```

## config inspector

eslint has a visual tool to help view what rules are enabled in a project and which files they are applied to, [`@eslint/config-inspector`]. go to the project root that contains a `eslint.config` file and run:

```bash
pnpm dlx @eslint/config-inspector
```

## versioning

the petal projects follows [semantic versioning] for its release cycle. however, since this is a recommended configuration and has many constantly updating plugins and moving parts, rule changes **are not** treated as breaking changes.

this is a petal project, and as such is released in observence with the rest of the petal monorepo. version bumps will come out as patches in regular intervals as other petal projects are updated.

### changes considered breaking changes

- peer and node.js version requirement changes
- large refactors that may break existing configurations
- plugin updates with breaking changes that may break existing configurations
- changes that effect most of the codebase

### changes not considered as breaking changes

- enabling or disabling of rules (may become stricter)
- changing of rules options
- patch version bumps of dependencies

## FAQ

### prettier?

using prettier isn't recommended, but you can still use it to format files that are not supported well by eslint yet, such as `.css`, `.html`, etc. (see [formatters](#formatters) for more details).

### dprint?

[`dprint`] is also a great formatter with more customization. however, it follows the same ast-based model as prettier (leading to inconsistent diff and ignoring line breaks). in general, we prefer to use eslint to format and lint most code.

however, we do have dprint integration for formatting other files such as `.md` (see [formatters](#formatters) for more details).

### css formatting?

you can opt-in to the [`formatters`](#formatters) feature to format css. this would only format the code, not lint it. for proper linting support, you can try [`stylelint`], or [`unocss`] and the [unocss integration](#unocss).

### majorly opinionated rules?

some rules set by default are very opinionated, and as such, we include an option to disable some rules. you can use the `opinionated` toggle as follows:

```js
// eslint.config.js
import { defineConfig } from '@flowr/eslint';

export default defineConfig({
	opinionated: false, // by default this is `true`; `false` disables the opinionated rules
});
```

[configs]: https://github.com/pulseflow/petal/blob/main/packages/eslint/src/configs
[factory]: https://github.com/pulseflow/petal/blob/main/packages/eslint/src/factory.ts
[eslint flat config]: https://eslint.org/docs/latest/use/configure/configuration-files
[stylistic]: https://eslint.style/
[vscode eslint extension]: https://github.com/Microsoft/vscode-eslint#readme
[type aware rules]: https://typescript-eslint.io/getting-started/typed-linting/
[semantic versioning]: https://semver.org/
[`dprint`]: https://dprint.dev/
[`stylelint`]: https://stylelint.io/
[`unocss`]: https://unocss.dev/

[`eslint-plugin-import-x`]: https://github.com/un-es/eslint-plugin-import-x
[`eslint-plugin-n`]: https://github.com/eslint-community/eslint-plugin-n
[`eslint-plugin-yml`]: https://ota-meshi.github.io/eslint-plugin-yml/
[`@typescript-eslint/eslint-plugin`]: https://typescript-eslint.io/packages/eslint-plugin
[`@stylistic/eslint-plugin`]: https://eslint.style/
[`@vitest/eslint-plugin`]: https://github.com/vitest-dev/eslint-plugin-vitest
[`eslint-plugin-vuejs-accessibility`]: https://vue-a11y.github.io/eslint-plugin-vuejs-accessibility/
[`eslint-plugin-command`]: https://eslint-plugin-command.antfu.me/
[`@eslint/config-inspector`]: https://github.com/eslint/config-inspector
[`eslint-plugin-json-schema-validator`]: https://ota-meshi.github.io/eslint-plugin-json-schema-validator/
[`prefer-const`]: https://eslint.org/docs/rules/prefer-const
[`unused-imports/no-unused-imports`]: https://github.com/sweepline/eslint-plugin-unused-imports
[`petal/no-only-tests`]: ../eslint-plugin/src/rules/no-only-tests.md
[npm-version-src]: https://img.shields.io/npm/v/@flowr/eslint?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/@flowr/eslint
[npm-downloads-src]: https://img.shields.io/npm/dm/@flowr/eslint?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/@flowr/eslint

# @flowr/eslint-config

[![npm](https://img.shields.io/npm/v/@flowr/eslint-config?color=444&label=)](https://npmjs.com/package/@flowr/eslint-config)

- easy reasonable defaults with just one line of config
- auto fix for formatting and best practices (**without** prettier)
- designed to work with typescript, jsx, json, yaml, toml, markdown, etc. out of the box
- optional [react](#react), [unocss](#unocss), [solid](#solid), [astro](#astro), [vue](#vue) and [svelte](#svelte) support
- optional [formatter](#formatters) support for css, html, xml, graphql, etc.
- easily composable [eslint flat config][eslint-flat]
- respects `.gitignore` by default, without the need for `.eslintignore`
- **petal specification**: minimal, stable, consistent code and diffs
  - sorted imports, dangling commas
  - single quotes, semicolons
  - uses [eslint stylistic][stylistic]
- supports eslint v9 or v8.50.0+

## usage

### installation

```bash
pnpm i -D eslint @flowr/eslint-config
```

### create config file

```js
// eslint.config.mjs
import petal from '@flowr/eslint-config';

export default petal();
```

<details>
<summary>
combined with a legacy configuration:
</summary>

if you still use some configuration from the legacy eslintrc format, you can use the [`@eslint/eslintrc`](https://www.npmjs.com/package/@eslint/eslintrc) package to convert them to the flat config.

```js
// eslint.config.mjs
import petal from '@flowr/eslint-config';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat()

export default petal(
    {
        ignores: [],
    },

    // legacy config
    ...compat.config({
        'eslint:recommended',
        // other legacy config options...
    }),

    // other flat configs...
);
```

> note that `.eslintignore` no longer works in flat config, see [customization](#customization) for more details.
</details>

### lint script

```json
{
    "scripts": {
        "lint": "eslint .",
        "lint:fix": "eslint . --fix"
    }
}
```

## ide integration

### vscode support (auto fix on save)

install the [vscode eslint extension][vscode] and add the following settings to your `.vscode/settings.json`:

```jsonc
{
    // enable the eslint flat config support
    // (remove this if your ESLint extension above v3.0.5)
    "eslint.experimental.useFlatConfig": true,
    
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
        { "rule": "@stylistic/*", "severity": "warn" },
        { "rule": "style*", "severity": "warn" },
        { "rule": "*-indent", "severity": "warn" },
        { "rule": "*-spacing", "severity": "warn" },
        { "rule": "*-spaces", "severity": "warn" },
        { "rule": "*-order", "severity": "warn" },
        { "rule": "*-dangle", "severity": "warn" },
        { "rule": "*-newline", "severity": "warn" },
        { "rule": "*quotes", "severity": "warn" },
        { "rule": "*semi", "severity": "warn" }
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

## customization

we use [eslint's flat config feature][eslint-flat]. it provides much better orginzation and composition. normally you only need to import and use the `petal` preset:

```js
// eslint.config.js
import petal from '@flowr/eslint-config';

export default petal();
```

alternatively, you can confgure each integration individually, for example:

```js
// eslint.config.js
import petal from '@flowr/eslint-config';

export default petal({
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

the `petal` factory function also accepts any number of arbitrary custom config overrides:

```js
// eslint.config.js
import petal from '@flowr/eslint-config';

export default petal(
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
    combine, comments, ignores, imports,
    javascript, jsdoc, jsonc, markdown,
    node, sortPackageJson, sortTsconfig,
    stylistic, toml, typescript, unicorn,
    vue, yaml,
} from '@flowr/eslint-config';

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

check out the [configs][configs] and [factory][factory] for more details.

### plugins remaining

since [flat config][eslint-flat] allows us to explicitly provide the plugin names (rather than the mandatory convention derived from the npm package name), we renamed some plugins to make the overall scope more consistent and easier to write:

| New Prefix | Original Prefix        | Source Plugin                                                                              |
| ---------- | ---------------------- | ------------------------------------------------------------------------------------------ |
| `import/*` | `i/*`                  | [eslint-plugin-import-x](https://github.com/un-es/eslint-plugin-import-x)                  |
| `node/*`   | `n/*`                  | [eslint-plugin-n](https://github.com/eslint-community/eslint-plugin-n)                     |
| `yaml/*`   | `yml/*`                | [eslint-plugin-yml](https://github.com/ota-meshi/eslint-plugin-yml)                        |
| `ts/*`     | `@typescript-eslint/*` | [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint) |
| `style/*`  | `@stylistic/*`         | [@stylistic/eslint-plugin](https://github.com/eslint-stylistic/eslint-stylistic)           |
| `test/*`   | `vitest/*`             | [eslint-plugin-vitest](https://github.com/veritem/eslint-plugin-vitest)                    |

when you want to override rules, or disable them inline, you need to update to the new prefix (unfortunately the vscode eslint extension doesn't automatically rewrite this):

```diff
-// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
+// eslint-disable-next-line ts/consistent-type-definitions
type foo = { bar: 2 }
```

### rules overrides

certain rules would only be enabled in specific files, for example `ts/*` rules would only be enabled in `.ts` files. if you want to override those rules, you need to specifiy the file extension:

```js
// eslint.config.js
import petal from '@flowr/eslint-config';

export default petal(
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
import petal from '@flowr/eslint-config';

export default petal({
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

the factory function `petal()` returns a [`FlatConfigComposer` object from `eslint-flat-config-utils`](https://github.com/antfu/eslint-flat-config-utils#composer) where you can chain the methods to compose the config even more flexibly.

```js
// eslint.config.ks
import petal from '@flowr/eslint-config';

export default petal()
    .prepend(
        // some configs before the main config
    )
    .override(
        'petal/imports',
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

### vue

vue support is auto-detected based on the `vue` dependency. you can also explicitly enable or disable it:

```js
// eslint.config.js
import petal from '@flowr/eslint-config';

export default petal({
    vue: true,
});
```

the required dev dependencies are: `eslint-plugin-vue vue-eslint-parser` (you should be prompted to install these when running eslint)

if you have `vue.sfcBlocks` enabled (set to enabled by default), you will also need to install `eslint-processor-vue-blocks` as a dev dependency, also prompted upon running eslint

#### vue 2

we have limited support for vue 2 (as it's already [reached eol](https://v2.vuejs.org/eol/)). if you are still using vue 2, you can set it manually by setting `vueVersion` to `2`.

```js
// eslint.config.js
import petal from '@flowr/eslint-config';

export default petal({
    vue: {
        vueVersion: 2,
    },
});
```

this support may be removed when `eslint-plugin-vue` drops support for vue 2 and it is recommended to update to vue 3 if possible.

### optional configs

we provide some additional configs for specific cases, that we don't include their dependencies by default to reduce package size:

#### formatters

use external formatters to format files that eslint cannot handle yet (`.css`, `.html`, etc.)

```js
// eslint.config.js
import petal from '@flowr/eslint-config';

export default petal({
    formatters: {
        /**
         * format CSS, LESS, SCSS files, also the `<style>` blocks in vue
         * uses prettier by default
         */
        css: true,
        
        /**
         * format HTML files
         * uses prettier by default
         */
        html: true,

        /**
         * format markdown files
         * supports prettier and dprint
         * uses prettier by default
         */
        markdown: 'prettier', // also 'dprint' or `true` (default)
    },
    /* ... */
});
```

the required dev dependencies are: `eslint-plugin-format` (you should be prompted to install these when running eslint)

#### react

to enable react support, you need to explicitly turn it on:

```js
// eslint.config.js
import petal from '@flowr/eslint-config';

export default petal({
    react: true,
});
```

the required dev dependencies are: `@eslint-react/eslint-plugin eslint-plugin-react-hooks` (you should be prompted to install these when running eslint)

#### astro

to enable astro support, you need to explicitly turn it on or install the `astro` dependency, in which case it is auto-detected:

```js
// eslint.config.js
import petal from '@flowr/eslint-config';

export default petal({
    astro: true,
});
```

the required dev dependencies are: `eslint-plugin-astro` (you should be prompted to install these when running eslint)

#### svelte

to enable svelte support, you need to explicitly turn it on, or install a svelte related dependency, in which case it is auto-detected:

```js
// eslint.config.js
import petal from '@flowr/eslint-config';

export default petal({
    svelte: true,
});
```

the required dev dependencies are: `eslint-plugin-svelte` (you should be prompted to install these when running eslint)

#### unocss

to enable unocss support, you need to explicitly turn it on:

```js
// eslint.config.js
import petal from '@flowr/eslint-config';

export default petal({
    unocss: true,
});
```

the required dev dependencies are: `@unocss/eslint-plugin` (you should be prompted to install these when running eslint)

#### solid

to enable solid support, you need to explicitly turn it on, or install a solid-related dependency, in which case it is auto-detected:

```js
// eslint.config.js
import petal from '@flowr/eslint-config';

export default petal({
    solid: true,
});
```

the required dev dependencies are: `eslint-plugin-solid` (you should be prompted to install these when running eslint)

### optional rules

we also provide some optional plugins and rules for extended/stricter usage:

#### `command`

the plugin by [`eslint-plugin-command`](https://github.com/antfu/eslint-plugin-command) allows you to add on-demand micro codemods that trigger on specific comment commands:

- `/// to-function` - converts an arrow function to a normal function
- `/// to-arrow` - converts a normal function to an arrow function
- `/// to-for-each` - converts a for-in/for-of loop to `.forEach()`
- `/// to-for-of` - converts `.forEach()` to a for-in/for-of loop
- `/// keep-sorted` - sorts an object/array/interface
- ... etc. - refer to the [docs](https://github.com/antfu/eslint-plugin-command#built-in-commands)

you can add the trigger comment one line above the code you want to transform (note the triple slash):

<!-- eslint-skip -->
```ts
/// to-function
const foo = async (bar: string): void => {
    console.log(bar);
};
```

will be transformed into the following upon saving or running `eslint . --fix`:

```ts
async function foo(bar: string): void {
    console.log(bar);
}
```

the command comments are one-off and removed with the codemod transformation.

### type aware rules

configuration for [type aware rules][type-aware] can be enabled by passing the options object to the `typescript` configuration:

```js
// eslint.config.js
import petal from '@flowr/eslint-config';

export default petal({
    typescript: {
        tsconfigPath: 'tsconfig.json',
    },
});
```

### editor specific disables

certain rules are disabled when inside [eslint ide integrations](#ide-integration), namely [`unused-imports/no-unused-imports`](https://www.npmjs.com/package/eslint-plugin-unused-imports) and [`petal/no-only-tests`](../eslint-plugin/src/rules/no-only-tests.md).

this is to prevent unused imports and temporary patches from getting removed by the ide during refactoring. those rules are applied when eslint is ran in the terminal. you can disable this behavior using:

```js
// eslint.config.js
import petal from '@flowr/eslint-config';

export default petal({
    isInEditor: false,
});
```

## config inspector

eslint has a visual tool to help view what rules are enabled in a project and which files they are applied to, [`@eslint/config-inspector`](https://github.com/eslint/config-inspector). go to the project root that contains a `eslint.config.js` file and run:

```bash
pnpm dlx @eslint/config-inspector
```

## versioning

the petal projects follows [semantic versioning](https://semver.org/) for its release cycle. however, since this is a recommended configuration and has many constantly updating plugins and moving parts, rule changes **are not** treated as breaking changes.

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

[dprint](https://dprint.dev/) is also a great formatter with more customization. however, it follows the same ast-based model as prettier (leading to inconsistent diff and ignoring line breaks). in general, we prefer to use eslint to format and lint most code.

however, we do have dprint integration for formatting other files such as `.md` (see [formatters](#formatters) for more details).

### css formatting?

you can opt-in to the [`formatters`](#formatters) feature to format css. this would only format the code, not lint it. for proper linting support, you can try [`stylelint`](https://stylelint.io/), or [`unocss`](https://unocss.dev/) and the [`unocss` integration](#unocss).

### majorly opinionated rules?

some rules set by default are very opinionated, and as such, we include an option to disable some rules. you can use the `opinionated` toggle as follows:

```js
// eslint.config.js
import petal from '@flowr/eslint-config';

export default petal({
    opinionated: false, // by default this is `true`; `false` disables the opinionated rules
});
```

[configs]: https://github.com/pulseflow/petal/blob/main/packages/eslint-config/src/configs
[factory]: https://github.com/pulseflow/petal/blob/main/packages/eslint-config/src/factory.ts
[eslint-flat]: https://eslint.org/docs/latest/use/configure/configuration-files
[stylistic]: https://github.com/eslint-stylistic/eslint-stylistic
[vscode]: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
[type-aware]: https://typescript-eslint.io/getting-started/typed-linting/

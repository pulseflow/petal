# @flowr/eslint-config

[![npm](https://img.shields.io/npm/v/@flowr/eslint-config?color=444&label=)](https://npmjs.com/package/@flowr/eslint-config)

- single quotea and semicolons
- sorted imports and best practices
- easy reasonable defaults with only one line of config
- auto fix for formatting (without prettier)
- designed to work with typescript, jsx and vue out of the box
- lints also for json, yaml, toml and markdown
- optional [react and astro](#non-vue-ui-frameworks), [unocss](#unocss) and [svelte](#svelte) support
- heavily opinionated very [customizable](#customization)
- easily composable [eslint flat config][eslint-flat]
- uses [eslint stylistic][stylistic] standards by default
- respects `.gitignore` by default, without the need for `.eslintignore`
- optional [formatter](#formatters) support for css, html, graphql, etc

> [!IMPORTANT]
> this config uses the new [eslint flat config][eslint-flat]. this may require new integeration configuration and some adjustments.

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

If you still use some configs from the legacy eslintrc format, you can use the [`@eslint/eslintrc`](https://www.npmjs.com/package/@eslint/eslintrc) package to convert them to the flat config.

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
        // other extends...
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
        "gql"
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
    jest: true,
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

going more advanced, you can also import fine-grainec configs and compose them as wanted:

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
);
```

</details>

check out the [configs][configs] and [factory][factory] for more details.

### plugins remaining

since [flat config][eslint-flat] requires us to explicitly provide the plugin names (rather than the mandatory convention derived from the npm package name), we renamed some plugins to make the overall scope more consistent and easier to write:

| New Prefix | Original Prefix        | Source Plugin                                                                              |
| ---------- | ---------------------- | ------------------------------------------------------------------------------------------ |
| `import/*` | `i/*`                  | [eslint-plugin-import-x](https://github.com/un-es/eslint-plugin-import-x)                                |
| `node/*`   | `n/*`                  | [eslint-plugin-n](https://github.com/eslint-community/eslint-plugin-n)                     |
| `yaml/*`   | `yml/*`                | [eslint-plugin-yml](https://github.com/ota-meshi/eslint-plugin-yml)                        |
| `ts/*`     | `@typescript-eslint/*` | [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint) |
| `style/*`  | `@stylistic/*`         | [@stylistic/eslint-plugin](https://github.com/eslint-stylistic/eslint-stylistic)           |
| `test/*`   | `vitest/*`             | [eslint-plugin-vitest](https://github.com/veritem/eslint-plugin-vitest)                    |
| `test/*`   | `no-only-tests/*`      | [eslint-plugin-no-only-tests](https://github.com/levibuzolic/eslint-plugin-no-only-tests)  |

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
        'petal/imports'
    )
    .renamePlugins({
        'old-prefix': 'new-prefix',
        // ...
    });
// ...
```

### vue

vue support is auto-detected. you can also explicitly enable it:

```js
// eslint.config.js
import petal from '@flowr/eslint-config';

export default petal({
    vue: true,
});
```

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

this support may be removed when `eslint-plugin-vue` drops support for vue 2. i recommend updating to vue 3.

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
});
```

the required dev dependencies are: `eslint-plugin-format` (you should be prompted to install these when running eslint)

#### non-vue ui frameworks

to enable framework support, you need to explicitly turn it on:

```js
// eslint.config.js
import petal from '@flowr/eslint-config';

export default petal({
    react: true,
    astro: true,
});
```

the required dev dependencies are: `@eslint-react/eslint-plugin eslint-plugin-react-hooks eslint-plugin-react-refresh eslint-plugin-astro` (you should be prompted to install these when running eslint - astro is only required with astro integration)

#### svelte

to enable svelte support, you need to explicitly turn it on:

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

### optional rules

we also provide some optional plugins and rules for extended/stricter usage:

### `prefectionist` sorting

the plugin [`eslint-plugin-perfectionist`](https://github.com/azat-io/eslint-plugin-perfectionist) sorts object keys and imports with auto-fix. the plugin is installed, but no rules are enabled by default. it's recommended to opt-in on each file individually using [configuration comments][config-comments].

```js
/* eslint perfectionist/sort-objects: "error" */
const objectWantedToSort = {
    a: 2,
    b: 1,
    c: 3,
};
```

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

## FAQ

### prettier?

using prettier isn't recommended, but you can still use it to format files that are not supported well by eslint yet, such as `.css`, `.html`, etc. (see [formatters](#formatters) for more details).

### dprint?

[dprint](https://dprint.dev/) is also a great formatter with more customization. however, it follows the same ast-based model as prettier (leading to inconsistent diff and ignoring line breaks). in general, we prefer to use eslint to format and lint most code.

however, we do have dprint integration for formatting other files such as `.md` (see [formatters](#formatters) for more details).

[configs]: https://github.com/pulseflow/petal/blob/main/configs/eslint-config/src/configs
[factory]: https://github.com/pulseflow/petal/blob/main/configs/eslint-config/src/factory.ts
[eslint-flat]: https://eslint.org/docs/latest/use/configure/configuration-files-new
[stylistic]: https://github.com/eslint-stylistic/eslint-stylistic
[vscode]: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
[config-comments]: https://eslint.org/docs/latest/use/configure/rules#using-configuration-comments-1
[type-aware]: https://typescript-eslint.io/linting/typed-linting

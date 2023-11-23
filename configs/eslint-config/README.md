# @flowr/eslint-config

[![npm](https://img.shields.io/npm/v/@flowr/eslint-config?color=444&label=)]

- single quotes with semi
- auto fix for formatting (**without** prettier)
- designed to work with a multitude of frameworks out-of-the-box
- configs for json, yaml, markdown, and petal config
- sorted imports, dangling commas
- reasonable defaults, best practices, only one line of config
- respects `.gitignore` by default
- uses new [eslint flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new).
- uses [eslint stylistic](https://github.com/eslint-stylistic/eslint-stylistic)
- works seamlessly with [petal](../../core/petal/)
- **core style principles**: minimal for reading, stable, consistant, and a11y

Petal's TypeScript full ESLint config.

## Usage

### Install

```sh
pnpm add -D eslint @flowr/eslint-config
```

### Create config file

With [`"type": "module"`](https://nodejs.org/api/packages.html#type) in `package.json` (recommended):

```js
// eslint.config.(m)js
import petal from '@flowr/eslint-config';

export default await petal();
```

With the [`petal cli`](../../core/petal/) (recommended, no config file needed):

```sh
pnpm petal lint
```

> Note that `.eslintignore` no longer works in flat config, see [customization](#customization) for more info.

## VSCode(ium) Support (auto fix)

Install the [VSCode ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

Add the following settings to your `.vscode/settings.json`:

```jsonc
{
    // Enable the ESlint flat config support
    "eslint.experimental.useFlatConfig": true,

    // Disable the default formatter, use eslint instead
    "prettier.enable": false,
    "editor.formatOnSave": false,

    // Auto fix
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": "explicit",
        "source.organizeImports": "never"
    },

    // Silent the stylistic rules in you IDE, but still auto fix them
    "eslint.rules.customizations": [
        { "rule": "style/*", "severity": "off" },
        { "rule": "*-indent", "severity": "off" },
        { "rule": "*-spacing", "severity": "off" },
        { "rule": "*-spaces", "severity": "off" },
        { "rule": "*-order", "severity": "off" },
        { "rule": "*-dangle", "severity": "off" },
        { "rule": "*-newline", "severity": "off" },
        { "rule": "*quotes", "severity": "off" },
        { "rule": "*semi", "severity": "off" }
    ],

    // Enable eslint for all supported languages
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
        /* ... */
    ]
}
```

## Customization

Normally you only need to import the `petal` preset (auto-detects dependencies and stylistic options):

```js
// eslint.config.(m)js
import petal from '@flowr/eslint-config'

export default await petal()
```

And that's it! Or you can configure each integration individually, for example:

```js
// eslint.config.(m)js
import petal from '@flowr/eslint-config'

export default await petal({
    // Enable stylistic formatting rules
    // stylistic: true,

    // Or customize the stylistic rules
    stylistic: {
        indent: 'tab', // 2, 4, or 'tab'
        quotes: 'single', // or 'double'
    },

    // frameworks are auto-detected, you can also explicitly enable them:
    typescript: true,
    vue: true,
    react: true,
    jest: true,
    astro: true,

    // Disable jsonc and yaml support
    jsonc: false,
    yaml: false,

    // `.eslintignore` is no longer supported in Flat config, use `ignores` or `.gitignore` instead
    ignores: [
        './fixtures',
        // ...any `glob`(s)
    ],
})
```

The `petal` factory function also accepts any number of arbitrary custom config overrides:

```js
// eslint.config.(m)js
import petal from '@flowr/eslint-config'

export default await petal(
    {
        // Configures for Petal's config
    },

    // From the second arguments they are ESLint Flat Configs
    // you can have multiple configs
    {
        files: ['**/*.ts'],
        rules: {},
    },
    {
        rules: {},
    },
);
```

Check out the [configs](https://github.com/pulseflow/petal/blob/main/configs/eslint-config/src/configs) and [factory](https://github.com/pulseflow/petal/blob/main/configs/eslint-config/src/factory.ts) for more details.

### Plugins Renaming

Since flat config requires us to explicitly provide the plugin names (instead of mandatory convention from npm package name), we renamed some plugins to make overall scope more consistent and easier to write.

| New Prefix | Original Prefix | Source Plugin |
| --- | --- | --- |
| `import/*` | `i/*` | [eslint-plugin-i](https://github.com/un-es/eslint-plugin-i) |
| `node/*` | `n/*` | [eslint-plugin-n](https://github.com/eslint-community/eslint-plugin-n) |
| `yaml/*` | `yml/*` | [eslint-plugin-yml](https://github.com/ota-meshi/eslint-plugin-yml) |
| `ts/*` | `@typescript-eslint/*` | [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint) |
| `style/*` | `@stylistic/*` | [@stylistic/eslint-plugin](https://github.com/eslint-stylistic/eslint-stylistic) |
| `test/*` | `vitest/*` | [eslint-plugin-vitest](https://github.com/veritem/eslint-plugin-vitest) |
| `test/*` | `no-only-tests/*` | [eslint-plugin-no-only-tests](https://github.com/levibuzolic/eslint-plugin-no-only-tests) |

When you want to override rules, or disable them inline, you need to update to the new prefix:

```diff
-// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
+// eslint-disable-next-line ts/consistent-type-definitions
type foo = { bar: 2 }
```

### Rules Overrides

Certain rules would only be enabled in specific files, for example, `ts/*` rules would only be enabled in `.ts` files and `vue/*` rules would only be enabled in `.vue` files. If you want to override the rules, you need to specify the file extension:

```js
// eslint.config.(m)js
import petal from '@flowr/eslint-config'

export default await petal(
    {
        vue: true,
        typescript: true,
    },
    {
        // Remember to specify the file `glob` here.
        files: ['**/*.vue'],
        rules: {
            'vue/operator-linebreak': ['error', 'before'],
        },
    },
    {
        // Without `files`, they are general rules for all files
        rules: {
            'style/semi': ['error', 'never'],
        },
    },
);
```

We also provided an `overrides` options to make it easier:

```js
// eslint.config.(m)js
import petal from '@flowr/eslint-config'

export default petal({
    overrides: {
        vue: {
            'vue/operator-linebreak': ['error', 'before'],
        },
        typescript: {
        'ts/consistent-type-definitions': ['error', 'interface'],
        },
        yaml: {},
        // ...
    },
});
```

### Optional Rules

This config also provides some optional plugins/rules for extended usages.

#### `perfectionist` (sorting)

This plugin [`eslint-plugin-perfectionist`](https://github.com/azat-io/eslint-plugin-perfectionist) allows you to sorted object keys, imports, etc, with auto-fix.

The plugin is installed but no rules are enabled by default.

It's recommended to opt-in on each file individually using [configuration comments](https://eslint.org/docs/latest/use/configure/rules#using-configuration-comments-1).

```js
/* eslint perfectionist/sort-objects: "error" */
const objectWantedToSort = {
    a: 2,
    b: 1,
    c: 3,
};
/* eslint perfectionist/sort-objects: "off" */
```

### Type Aware Rules

You can optionally enable the [type aware rules](https://typescript-eslint.io/linting/typed-linting/) by passing the options object to the `typescript` config:

```js
// eslint.config.js
import petal from '@flowr/eslint-config'

export default petal({
    typescript: {
        tsconfigPath: 'tsconfig.json',
    },
});
```

### Lint Staged

If you want to apply lint and auto-fix before every commit, you can add the following to your `package.json`:

```json
{
    "scripts": {
        "precommit": "petal hooks precommit",
        "postinstall": "petal hooks install",
    },
}
```

and then

```bash
pnpm add -D @flowr/petal
```

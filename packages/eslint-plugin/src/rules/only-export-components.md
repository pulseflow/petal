# only-export-components

Validates that JSX components can be updated using fast refresh, ensuring they comply which whatever HMR framework is used (Remix, Vite, React, etc.).

Adapted from [`eslint-plugin-react-refresh`](https://github.com/ArnaudBarre/eslint-plugin-react-refresh)

## Rule Details

<!-- eslint-skip -->
```jsx
// 👎 bad
export default const Bar = () => <></>;

// 👎 bad
export * from './foo';

// 👎 bad
export default compose()(MainComponent);

// 👎 bad
const Tab = () => {};
export const tabs = [<Tab />, <Tab />];

// 👎 bad
const App = () => {};
createRoot(document.getElementById('root')).render(<App />);
```

<!-- eslint-skip -->
```jsx
// 👍 good (with `allowConstantExport`)
export const CONSTANT = 3;
export const Foo = () => <></>;

// 👍 good
export default function Foo() {
    return <></>;
}

// 👍 good
const foo = () => {};
export const Bar = () => <></>;

// 👍 good
import { App } from './App';
createRoot(document.getElementById('root')).render(<App />);
```

## Limitations

In order to avoid false positives, this plugin only checks `.tsx` and `.jsx` files by default. You can use the [`checkJS`](#checkjs) option to also check `.js` files.

This plugin relies on naming conventions (i.e. `PascalCase` for components, and `camelCase` for utility functions, `SCREAMING_SNAKE_CASE` for constants, etc.), which means there are certain limitations:

* `export *` declarations are unsupported and are reported as errors.
* Anonymous functions are unsupported (i.e. `export default function() {}`).
* Class components are unsupported.
* `SCREAMING_SNAKE_CASE` function exports are considered as errors when not using direct named export (e.g. `const CMS = () => <></>; export { CMS }`).
* Lazy loading and some constants are unsupported currently, awaiting fixes.

## Options

### `allowExportNames`

If you use a framework that handles HMR of some specific exports, you can use this option to avoid warning for them.

Example for the [Remix](https://remix.run/docs/en/main/other-api/dev#:~:text=React%20Fast%20Refresh,-can%20only%20handle) web framework:

<!-- eslint-skip -->
```js
{
    'petal/only-export-components': [
        'error',
        {
            'allowExportNames': ['meta', 'links', 'headers', 'loader', 'action'],
        },
    ],
}
```

### `allowConstantExport`

Disable warning when a constant (string, number, boolean, template literal) is exported aside one or more components.

This should be enabled if the fast refresh implementation correctly handles this case. (HMR when the constant doesn't change, propagate update to importers when the constant changes). Vite supports this.

<!-- eslint-skip -->
```js
{
    'petal/only-export-components': [
        'error',
        {
            'allowConstantExport': true,
        },
    ],
}
```

### `checkJS`

This allows the plugin to check for JSX within `.js` files. To reduce the number of false positives, only files that import the `react` library are checked.

<!-- eslint-skip -->
```js
{
    'petal/only-export-components': [
        'error',
        {
            'checkJS': true,
        },
    ],
}
```

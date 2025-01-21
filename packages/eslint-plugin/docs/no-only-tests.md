# no-only-tests

Disallow using `.only` blocks in JS testing libraries/suites, preventing pushing focused (`.only`) tests to CI/CD, which could prevent the entire test suite from running. If the testing framework used doesn't use `only` to focus tests, you can override the matchers.

Adapted from [`eslint-plugin-no-only-tests`](https://github.com/levibuzolic/eslint-plugin-no-only-tests)

## Rule Details

<!-- eslint-skip -->
```js
// 👎 bad
it.default.before(console.log).only("some random block", () => {});
```

<!-- eslint-skip -->
```js
// 👍 good
it.default.before(console.log).describe("some random block", () => {});
```

## Options

### `block`

Specifies the block names that your testing framework uses. Add a `*` to the end of any string to enable prefix matching (e.g., `test*` will match `testExample.only`).

If you use a testing framework that uses a test block name not in the defaults, or a different way of focusing tests (i.e. something other than `.only()`), you can specify an array of strings to match in the options.

### `focus`

Specifies the focus scope that your testing framework uses. (Defaults to `['only']`).

If you use a testing framework that uses a test block name not in the defaults, or a different way of focusing tests (i.e. something other than `.only()`), you can specify an array of strings to match in the options.

### `functions`

An array of strings that specify functions that are not permitted in general. (e.g., `['fit', 'xit']`).

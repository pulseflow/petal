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

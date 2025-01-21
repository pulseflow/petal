# no-ts-export-equal

Prefer using the ESM `export default` rather than `exports =`.

## Rule Details

<!-- eslint-skip -->
```js
// 👎 bad
const foo = 'foo';
export = foo;

// 👎 bad
const bar = 'bar';
export = { bar };
```

<!-- eslint-skip -->
```js
// 👍 good
const foo = 'foo';
export default foo;

// 👍 good
const bar = 'bar';
export default { bar };
```

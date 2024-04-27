# no-ts-export-equal

Prefer using the ESM `export default` rather than `exports =`.

## Rule Details

<!-- eslint-skip -->
```js
// 👎 bad
export = {}
```

<!-- eslint-skip -->
```js
// 👍 good
export default {}
```

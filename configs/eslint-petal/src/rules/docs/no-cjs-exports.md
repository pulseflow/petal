# no-cjs-exports

Enforces ESM exports rather than CJS exports.

## Rule Details

<!-- eslint-skip -->
```js
// 👎 bad
export = {}
exports.a = {}
module.exports.a = {}
```

<!-- eslint-skip -->
```js
// 👍 good
export default a;
export default { a };
export a;
export { a } from './index.ts';
```

# no-import-node-modules-by-path

Prevent importing modules in `node_modules` folder by the relative or absolute path.

## Rule Details

<!-- eslint-skip -->
```js
// 👎 bad
import foo from '../node_modules/foo';
const bar = require('../node_modules/bar');
```

<!-- eslint-skip -->
```js
// 👍 good
import foo from 'foo';
const bar = require('bar');
```

# no-import-node-modules-by-path

Prevent importing modules in `node_modules` folder by relative or absolute path.

## Rule Details

<!-- eslint-skip -->
```js
// 👎 bad
import a from '../node_modules/a';
const c = require('../node_modules/c');
```

<!-- eslint-skip -->
```js
// 👍 good
import a from 'a';
const a = require('a');
```

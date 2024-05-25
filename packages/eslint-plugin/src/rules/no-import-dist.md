# no-import-dist

Prevent importing modules in `dist` folder.

## Rule Details

<!-- eslint-skip -->
```js
// 👎 bad
import { Foo, Bar, Foo } from '../dist/index.js';
```

<!-- eslint-skip -->
```js
// 👍 good
import { Foo, Bar } from './index.ts';
```

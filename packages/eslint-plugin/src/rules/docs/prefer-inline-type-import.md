# prefer-inline-type-import

Prefer to import a specific type from the inline rather than the entire import statement; except in cases where all specific imports are types.

## Rule Details

<!-- eslint-skip -->
```js
// 👎 bad
import type { Foo } from 'foo'
```

<!-- eslint-skip -->
```js
// 👍 good
import { type Foo } from 'foo';
import type Foo from 'foo';
import type * as Foo from 'foo';
import type {} from 'foo';
```

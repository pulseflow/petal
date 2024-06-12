# indent-unindent

Enforce consistent indentation style for content inside template string with the `unindent` or `$` tags.

## Rule Details

<!-- eslint-skip -->
```js
// 👎 bad
import { unindent } from '@flowr/utils'

const cases = [
  unindent`
const foo = {
  bar: 'baz', qux: 'quux',
  fez: 'fum'
}`,
  unindent`
      if (true) {
        console.log('hello')
      }`,
]
```

<!-- eslint-skip -->
```js
// 👍 good
import { unindent as $ } from '@flowr/utils'

const cases = [
  $`
    const foo = {
      bar: 'baz', qux: 'quux',
      fez: 'fum'
    }
  `,
  $`
    if (true) {
      console.log('hello')
    }
  `,
]
```

By default it affects the template tag named `unindent`, `unIndent` or `$`. This rule works specifically for the `unindent` utility function from `@flowr/utils`, where the leading and trailing empty lines are removed, and the common indentation is removed from each line. This rule fixes the content inside the template string but shall not affect the runtime result.

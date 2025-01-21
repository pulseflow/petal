# no-discard-result

Disallow discarding the result of a function returning a `Result`.

## Rule Details

<!-- eslint-skip -->
```js
// 👎 bad
import { Result } from '@flowr/result';
function foo(): Promise<Result<string, string>> {}
null ?? foo();

// 👎 bad
import { Result } from '@flowr/result';
function foo(): Promise<Result<string, string>> {}
(foo(), await foo());

// 👎 bad
import { Result } from '@flowr/result';
async function foo(): Promise<Result<string, string>> {}
await foo();

// 👎 bad
import { Result } from '@flowr/result';
async function foo(): Promise<Result<string, string>> {}
foo();

// 👎 bad
import { Result } from '@flowr/result';
function foo(): Result<string, string> {}
foo();
```

<!-- eslint-skip -->
```js
// 👍 good
import { Result } from '@flowr/result';
function foo(): Result<string, string> {}
const x = foo();

// 👍 good
import { Result } from '@flowr/result';
function foo(): Result<string, string> {}
void foo();

// 👍 good
import { Result } from '@flowr/result';
function foo(): Result<string, string> {}
function bar(result: Result<string, string>) {}
void bar(foo());

// 👍 good
import { Result } from '@flowr/result';
function foo(): Result<string, string> {}
async function bar(): Promise<Result<string, string>> {}
let y = await bar(), z = (void 0, foo());
y = z = await bar();

// 👍 good
import { Result } from '@flowr/result';
function foo(): Result<string, string> {}
async function bar(): Promise<Result<string, string>> {}
const complex = foo() && (((Math.random() > 0.5 ? foo(): await bar()) || foo()) ?? await bar());
```

By default it affects the type named and with the shape of `Result<T, E, const Success extends boolean = boolean>`. This rule works only for the `Result` utility class from `@flowr/result`.

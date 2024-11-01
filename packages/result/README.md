# @flowr/result

**A TypeScript port of Rust's `Result<T>` and `Option<T>` structs**

## Installation

You can use the following command to install this package, or replace `pnpm add` with your package manager of choice.

```sh
pnpm add @flowr/result
```

## Usage

**Note:** While this section uses `import`, the imports match 1:1 with CJS imports. For example `const { Result } = require('@flowr/result')` equals `import { Result } from '@flowr/result'`.

### Wrapping synchronous `try-catch` blocks

**Old code without `Result.from`:**

```typescript
try {
	const returnCode = someFunctionThatMightThrow();
	return returnCode;
}
catch (error) {
	console.error(error);
	return null;
}
```

**New Code with `Result.from`:**

```typescript
import { Result } from '@flowr/result';

const returnCode = Result.from(() => someFunctionThatMightThrow());

return returnCode.unwrapOrElse((error) => {
	console.error(error);
	return null;
});
```

### Wrapping asynchronous `try-catch` blocks

**Old code without `Result.fromAsync`:**

```typescript
try {
	const returnCode = await someFunctionThatReturnsAPromiseAndMightReject();

	return returnCode;
}
catch (error) {
	console.error(error);
	return null;
}
```

**New Code with `Result.fromAsync`:**

```typescript
import { Result } from '@flowr/result';

const returnCode = await Result.fromAsync(async () => someFunctionThatReturnsAPromiseAndMightReject());

return returnCode.unwrapOrElse((error) => {
	console.error(error);
	return null;
});
```

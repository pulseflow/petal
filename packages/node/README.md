# @flowr/node

**Node-specific opinionated TypeScript utilities.**

## Installation

You can use the following command to install this package, or replace `pnpm add -D` with your package manager of choice.

```sh
pnpm add -D @flowr/node
```

## Utilities

### `findFilesRecursively`

Recursively searches for files in a directory and returns an [`AsyncIterableIterator`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_async_iterator_and_async_iterable_protocols) of the found paths.

```ts
import { findFilesRecursively } from '@flowr/node';

const files = findFilesRecursively('./src');
for await (const file of files)
	console.log(file);

// This, for example, could log:
// /root/src/index.js
// /root/src/database.csv
// /root/src/lib/utils/constants.json

// Alternate forms:
const files = findFilesRecursivelyStringStartsWith('./src', 'index'); // filename starts with "index"
const files = findFilesRecursivelyStringEndsWith('./src', '.js'); // filename ends with ".js"
const files = findFilesRecursivelyStringIncludes('./src', 'database'); // filename includes "database"
const files = findFilesRecursivelyRegex('./src', /\.[tj]sx?$/); // filename matches the regex
```

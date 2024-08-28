# file-header

Simple file header that adds a copyright/license/message to the top of files.

Adapted from [`eslint-plugin-simple-header`](https://codeberg.org/rini/eslint-plugin-simple-header)

## Rule Details

```ts
type PetalFileHeader = [] | [(({
	syntax?: string;
	decor?: string;
	[k: string]: unknown | undefined;
} | {

	syntax?: [string, string];

	decor?: [string, string, string];
	[k: string]: unknown | undefined;
}) & ({

	files: [string, ...string[]];
	[k: string]: unknown | undefined;
} | {
	text: (string | string[]);
	[k: string]: unknown | undefined;
}))];
```

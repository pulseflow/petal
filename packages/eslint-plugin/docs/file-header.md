# file-header

Simple file header that adds a copyright/license/message to the top of files.

Adapted from [`eslint-plugin-simple-header`](https://codeberg.org/rini/eslint-plugin-simple-header)

## Rule Details

Given the following configuration:

<!-- eslint-skip -->
```js
{
	'petal/file-header': [
		'error',
		{
			text: [
				'Copyright (c) {year} {author}',
				'SPDX-License-Identifier: GPL-3.0-or-later',
			],
			templates: { author: ['.*', 'author name' ] },
		},
	],
}
```

The rule will match a header like this:

<!-- eslint-skip -->
```text
/*
 * Copyright (c) 1970 Linus Torvalds
 * SPDX-License-Identifier GPL-3.0-or-later
 */
```

When running auto-fix, it will replace with the following header (where 2025 is the current year, if you are from the future):

<!-- eslint-skip -->
```text
/*
 * Copyright (c) 2025 author name
 * SPDX-License-Identifier GPL-3.0-or-later
 */
```

## Options

### `text`

This may be an array of lines, or an entire string. This can include comment syntax and won't be autoformatted (i.e. prefixed with `*`s).

### `files`

This is an array of paths, as an alternative to `text`. This can include comment syntax and won't be autoformatted (i.e. prefixed with `*`s).

### `templates`

Inside the header's text `{template}` snyntax can be used, which correlates to the `template` key. The first value is a regex used to match the header, and the second is a default value. By default, `{year}` matches `\d{4}` and defaults to the current year.

### `newlines`

Specifies exactly how many lines should be after the header, defaulting to `1`. If the file is empty otherwise, no newlines are added.

### `syntax`

Specifies the comment syntax, defaulting to `['/*', '*/']`. It can be different for different `files`, and may also be a string, for single-line comment blocks (e.g., `'//'`).

### `decor`

Specifies how the comment is formatted with a tuple of start, indent, and end. When `syntax` is a block comment, this defaults to `['\n', ' * ', '\n ']`, and defaults to `' '` otherwise.

### `linebreak`

Specifies the line ending to expect on files: `unix` for LF, `windows` for CRLF. By default, it uses `unix` or auto-detects based on the file.

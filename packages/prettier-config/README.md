# prettier-config

Petal's base Prettier config.

## Installation

```sh
pnpm add -D @flowr/prettier-config
```

## Usage

After installing, update your project's `prettier.config.js` file to import the rule sets you want:

```js
module.exports = {
	...require('@flowr/prettier-config'),
	// your overrides here
};
```

---

Read the [Prettier config docs](https://prettier.io) for more information.

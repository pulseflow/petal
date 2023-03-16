# @flowr/eslint-plugin-petal

This contains all Petal-specific eslint rules.

## Installation

```sh
pnpm add -D eslint @flowr/eslint-plugin-petal
```

## Rules

| Category       | Name                                    | Description                                                                          |
| -------------- | --------------------------------------- | ------------------------------------------------------------------------------------ |
| Best Practices | [`best-practices/no-discouraged-words`] | Prevents usage of specific words. [See more][`best-practices/no-discouraged-words`]. |

[`best-practices/no-discouraged-words`]: https://github.com/pulseflow/petal/blob/main/packages/eslint-petal/src/rules/best-practices/no-discouraged-words.md

## Usage

After installing, update your project's `.eslintrc.json` config:

```js
{
  "plugins": ["@flowr/eslint-plugin-petal"],
}
```

---

Read the [ESlint config docs](http://eslint.org/docs/user-guide/configuring#extending-configuration-files) for more information.

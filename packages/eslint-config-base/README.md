# @pulse/eslint-config-base

Petak's base ESLint config.

## Installation

```sh
pnpm add -D @pulse/eslint-config-base eslint
```

## Usage

After installing, update your project's `.eslintrc.json` file to import the rule sets you want:

```js
{
  "extends" : [
    "@pulse/eslint-config-base"
  ]
}
```

### ES5 only

```js
{
  "extends" : [
    "@pulse/eslint-config-base/es5"
  ]
}
```

### ES6+ only

```js
{
  "extends" : [
    "@pulse/eslint-config-base/es6"
  ]
}
```

---

Read the [ESlint config docs](http://eslint.org/docs/user-guide/configuring#extending-configuration-files)
for more information.

# @pulse/petal

[![Actions Status](https://github.com/pulseflow/petal/workflows/Tests/badge.svg)](https://github.com/pulseflow/petal/actions)
[![Version](https://img.shields.io/npm/v/@pulse/petal.svg)](https://www.npmjs.com/package/@pulse/petal)

A monorepo of base configs and CLI wrappers used to speed up development @ Pulse.

Want to use it? Check out the [CLI documentation](https://github.com/pulseflow/petal/blob/main/packages/petal) to get started!

## About this project

### petal CLI

[@pulse/petal](./packages/petal) is a CLI that combines shared configuration for building, linting, testing, formatting, and releasing libraries for Node and the browser.

```bash
pnpm add -D @pulse/petal husky
```

It is intended to be used within a project as a series of npm scripts.

```json
{
	"devDependencies": {
		"@pulse/petal": "^1.0.0",
		"husky": "^7.0.0"
	},
	"scripts": {
		"build": "petal build",
		"test": "petal test",
		"format": "petal format",
		"lint": "petal lint",
		"commit": "petal commit",
		"release": "petal release",
		"prepare": "husky install && petal audit"
	}
}
```

Additionally, you'll need to run the following two commands to create the commit and pre-commit hooks:

```shell
pnpm dlx husky set .husky/pre-commit 'pnpm petal precommit --no-tests --no-typecheck'

pnpm dlx husky set .husky/commit-msg 'pnpm petal commitmsg --edit="$1"' && \
  sed 's/edit=""/edit="$1"/g' .husky/commit-msg | tee .husky/commit-msg
```

NOTE: the second command uses sed to hack around [this bug in husky](https://github.com/typicode/husky/issues/1019) that removes `$1`.

You'll want to add and commit the `.husky` directory.

View the [full CLI documentation](./packages/petal) for more details on how to get started.

### Petal shared configurations

- [@pulse/eslint-config](./packages/eslint-config)
- [@pulse/eslint-config-base](./packages/eslint-config-base)
- [@pulse/eslint-config-react](./packages/eslint-config-react)
- [@pulse/eslint-config-typescript](./packages/eslint-config-typescript)
- [@pulse/petal-plugin](./packages/petal-plugin)
- [@pulse/prettier-config](./packages/prettier-config)
- [@pulse/tsconfig](./packages/tsconfig)

## Related projects we use

- [TypeScript]: a superset of JavaScript which we think helps make code readable and less bug-prone.
- [ESLint]: used for static code analysis with some auto-fixing.
- [Prettier]: use to format code pre-commit and automatically in your editor.
- [Jest]: our preferred JavaScript test framework.
- [husky]: allows us to hook into git events in a convenient way.
- [lint-staged]: allows us to write pre-commit hooks which target specific paths and run a series of commands.

[eslint]: https://eslint.org/
[typescript]: https://www.typescriptlang.org/
[prettier]: https://prettier.io/
[jest]: https://jestjs.io/
[husky]: https://github.com/typicode/husky
[lint-staged]: https://github.com/okonet/lint-staged

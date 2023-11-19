# @flowr/petal

[![Actions Status](https://github.com/pulseflow/petal/workflows/Tests/badge.svg)](https://github.com/pulseflow/petal/actions)
[![Version](https://img.shields.io/npm/v/@flowr/petal.svg)](https://www.npmjs.com/package/@flowr/petal)

A monorepo of base configs and CLI wrappers used to speed up development @ Pulse.

Want to use it? Check out the [CLI documentation](https://github.com/pulseflow/petal/blob/main/packages/petal) to get started!

## About this project

### petal CLI

[@flowr/petal](./core/petal) is a CLI that combines shared configuration for building, linting, testing, formatting, and releasing libraries and projects for Node, the Browser, and Rust.

```bash
pnpm add -D @flowr/petal
```

It is intended to be used within a project as a series of npm scripts.

```json
{
	"devDependencies": {
		"@flowr/petal": "^2.0.0"
	},
	"scripts": {
		"build": "petal build",
		"test": "petal test",
		"lint": "petal lint",
		"commit": "petal commit",
		"release": "petal release",
		"prepare": "petal prepare"
	}
}
```

View the [full CLI documentation](./core/petal) for more details on how to get started.

### Petal shared configurations

-   [@flowr/eslint-config](./configs/eslint-config)
-   [@flowr/petal-plugin](./configs/petal-plugin)
-   [@flowr/tsconfig](./configs/tsconfig)

## Related projects we use

-   [TypeScript]: a superset of JavaScript which we think helps make code readable and less bug-prone.
-   [ESLint]: used for static code analysis with auto-fixing.
-   [Vitest]: our preferred JavaScript test framework.
-   [lint-staged]: allows us to write pre-commit hooks which target specific paths and run a series of commands.

[eslint]: https://eslint.org/
[typescript]: https://www.typescriptlang.org/
[vitest]: https://vitest.dev/
[lint-staged]: https://github.com/okonet/lint-staged

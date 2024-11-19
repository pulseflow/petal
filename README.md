# @flowr/petal

[![Actions Status](https://github.com/pulseflow/petal/workflows/Tests/badge.svg)](https://github.com/pulseflow/petal/actions)
[![Version](https://img.shields.io/npm/v/@flowr/utilities.svg)](https://www.npmjs.com/package/@flowr/utilities)

A monorepo of configs and packages used to speed up development @ Pulseflow and ensure adherence to Petal standards.

## Petal Configuration Suite

- [`@flowr/eslint`](./packages/eslint): Standardized Petal specification linting configuration
- [`eslint-plugin-petal`](./packages/eslint-plugin): Custom ESLint rules for the Petal specification
- [`@flowr/typescript`](./packages/typescript): Common TSConfigs in Petal standardized projects

## Petal Utilities

- [`create-petal`](./packages/create-petal): WIP CLI utility for creating and migrating Petal projects
- [`@flowr/console`](./packages/console): WIP Utilities for logging with JavaScript.
- [`@flowr/utilities`](./packages/utilities): Universal utilities for Petal projects.

## Related projects we use

- [TypeScript]: a superset of JavaScript which we think helps make code readable and less bug-prone.
- [ESLint]: used for static code analysis with auto-fixing.
- [Vitest]: our preferred JavaScript test framework.

### Minimum Supported [Node] Version (MSNV)

For those using the Node runtime, the current minimum version for usage and development is [v20.11.0](https://github.com/nodejs/node/releases/tag/v20.11.0).

### TODO

- [ ] Use [`magic-regexp`](https://regexp.dev).
- [ ] Look into `@eslint/markdown`, `@eslint/css`, and `@eslint/json`.

[ESLint]: https://eslint.org/
[TypeScript]: https://www.typescriptlang.org/
[Vitest]: https://vitest.dev/
[Node]: https://nodejs.org/

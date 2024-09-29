# @flowr/petal

[![Actions Status](https://github.com/pulseflow/petal/workflows/Tests/badge.svg)](https://github.com/pulseflow/petal/actions)
[![Version](https://img.shields.io/npm/v/@flowr/utils.svg)](https://www.npmjs.com/package/@flowr/utils)

A monorepo of configs and packages used to speed up development @ Pulseflow and ensure adherence to Petal standards.

## Petal Configuration Suite

- [`@flowr/eslint-config`](./packages/eslint-config): Standardized Petal specification linting configuration
- [`eslint-plugin-petal`](./packages/petal-plugin): Custom ESLint rules for the Petal specification
- [`@flowr/typescript`](./packages/typescript): Common TSConfigs in Petal standardized projects

## Petal Utilities

- [`create-petal`](./packages/create-petal): WIP CLI utility for creating and migrating Petal projects
- [`@flowr/console`](./packages/console): WIP Utilities for logging with JavaScript.
- [`@flowr/utils`](./packages/utils): Universal utilities for Petal projects.

## Related projects we use (not exclusive)

- [TypeScript]: a superset of JavaScript which we think helps make code readable and less bug-prone.
- [ESLint]: used for static code analysis with auto-fixing.
- [Vitest]: our preferred JavaScript test framework.

[ESLint]: https://eslint.org/
[TypeScript]: https://www.typescriptlang.org/
[Vitest]: https://vitest.dev/

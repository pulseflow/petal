# @flowr/petal

[![Actions Status](https://github.com/pulseflow/petal/workflows/Tests/badge.svg)](https://github.com/pulseflow/petal/actions)
[![Version](https://img.shields.io/npm/v/@flowr/utilities.svg)](https://www.npmjs.com/package/@flowr/utilities)

## Packages

- [`create-petal`](./packages/create-petal): A CLI utility to create a new Petal app
- [`@flowr/crypto`](./packages/crypto):
- [`@flowr/eslint`](./packages/eslint): Standardized Petal specification linting configuration
- [`eslint-plugin-petal`](./packages/eslint-plugin): Custom ESLint rules for the Petal specification
- [`@flowr/fetch`](./packages/fetch): Small wrapper around `globalThis.fetch` for improved TypeScript and data support
- [`@flowr/iterator`](./packages/iterator): Opinionated collection of common iterator utilities
- [`@flowr/loader`](./packages/loader): A simple TypeScript code piece loader
- [`@flowr/metadata`](./packages/metadata): Useful TypeScript decorators for Petal projects
- [`@flowr/node`](./packages/node): Node-specific opinionated TypeScript utilities
- [`@flowr/result`](./packages/result): A TypeScript port of Rust's `Result<T>` and `Option<T>` structs
- [`@flowr/store`](./packages/store): <TODO>
- [`@flowr/types`](./packages/types): Essential TypeScript type utilities used in `@flowr/utilities`
- [`@flowr/typescript`](./packages/typescript): A collection of different base `tsconfig.json` to be extended from in your project.
- [`@flowr/utilities`](./packages/utilities): Opinionated collection of common TypeScript utilities

### Minimum Supported [Node.js](https://nodejs.org/) Version (MSNV)

The current minimum version for usage and development is [v22.11.0](https://github.com/nodejs/node/releases/tag/v22.11.0), with Node.js 22 ('Jod') LTS being recommended.

### TODO

- [ ] Use [`magic-regexp`](https://regexp.dev).
- [ ] Look into `@eslint/markdown`, `@eslint/css`, and `@eslint/json`.

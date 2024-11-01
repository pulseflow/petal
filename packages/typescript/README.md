# @flowr/typescript

**A collection of different base `tsconfig.json` to be extended from in your project.**

## Installation

You can use the following command to install this package, or replace `pnpm add` with your package manager of choice.

```sh
pnpm add -D @flowr/typescript
```

---

## Usage

This package ships a couple of different sets of tsconfig, they should be used in an array of `extends` in your `tsconfig.json` file. The supported configs are:

-   `@flowr/typescript/base` -> This is identical to `@flowr/typescript`
-   `@flowr/typescript/strict`
-   `@flowr/typescript/decorators`
-   `@flowr/typescript/verbatim`

You should always start with the base config, regardless of what other configs you choose. Next you can opt-in to the other configs.

Finally you should configure your package.json properly based on what kind of package you are writing

-   For CJS packages you should add `"type": "commonjs"` to your `package.json`
-   For ESM packages you should add `"type": "module"` to your `package.json`
-   For a package that is going to be used by both CJS and ESM then you should not add any `"type"` to your `package.json`

### Base

The base config (`@flowr/typescript`, or `@flowr/typescript/base`) is the default config with options set up in such a way that it will suite nearly all projects.

You can view the content of this tsconfig [here](https://github.com/pulseflow/petal/blob/main/packages/typescript/src/tsconfig.json)

### Strict

You should include this config if you want to extra strict checking. This configures the following compiler options:

-   [`allowUnreachableCode` to `false`](https://www.typescriptlang.org/tsconfig#allowUnreachableCode)
-   [`allowUnusedLabels` to `false`](https://www.typescriptlang.org/tsconfig#allowUnusedLabels)
-   [`exactOptionalPropertyTypes` to `false`](https://www.typescriptlang.org/tsconfig#exactOptionalPropertyTypes)
-   [`noImplicitOverride` to `true`](https://www.typescriptlang.org/tsconfig#noImplicitOverride)

You can view the content of this tsconfig [here](https://github.com/pulseflow/petal/blob/main/packages/typescript/src/strict.json)

### Decorators

You should include this config if you want to use decorators in the project using decorators from before the TC39 standardization process. This enables the following compiler options:

-   [experimentalDecorators](https://www.typescriptlang.org/tsconfig#experimentalDecorators)
-   [emitDecoratorMetadata](https://www.typescriptlang.org/tsconfig#emitDecoratorMetadata)

You can view the content of this tsconfig [here](https://github.com/pulseflow/petal/blob/main/packages/typescript/src/decorators.json)

## Contributing

Try to optimize for the fewest specified options between the config specializations. For example, only `app` has `noEmit: true`, since the [default value], `false`, is good for the `lib` config. Specifying it only in the `app` config means fewer overall entries!

We want to keep maintenance low by only specifying what is necessary. If the option's [default value] is good for every config, remove it from every config!

[default value]: https://www.typescriptlang.org/docs/handbook/compiler-options.html

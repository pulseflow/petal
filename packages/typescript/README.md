# @flowr/typescript

A collection of different base `tsconfig.json` to be extended from in your project.

## Installation

Using npm or yarn:

```sh
pnpm add -D @flowr/typescript
```

## Contributing

Try to optimize for the fewest specified options between the config specializations. For example, only `app` has `noEmit: true`, since the [default value], `false`, is good for the `lib` config. Specifying it only in the `app` config means fewer overall entries!

We want to keep maintenance low by only specifying what is necessary. If the option's [default value] is good for every config, remove it from every config!

[default value]: https://www.typescriptlang.org/docs/handbook/compiler-options.html

# @flowr/types

**Essential TypeScript types used in `@flowr/utilities`**

## Installation

You can use the following command to install this package, or replace `pnpm add` with your package manager of choice.

```sh
pnpm add -D @flowr/types
```

---

## Usage

You can import individual utility function from subpath like: `@flowr/types/deepReadonly` or the entire library.

```ts
import type { DeepReadonly } from '@flowr/types';
/* alternatively... */
import type { DeepReadonly } from '@flowr/types/deepReadonly';
```

### Documentation

#### Types

##### `Primitive`

A union of all primitive types.

```ts
// string | number | bigint | boolean | symbol | undefined | null
declare const primitive: Primitive;
```

##### `Builtin`

A union of all builtin types.

```ts
// Primitive | Function | Date | Error | RegExp
declare const builtin: Builtin;
```

##### `DeepReadonly`

Makes all properties in `T` readonly recursively.

```ts
type Foo = Set<{ bar?: ['foo', { hello: 'world' }] }>;

// ReadonlySet<{
//     readonly bar?: readonly ["foo", {
//         readonly hello: "world";
//     }] | undefined;
// }>
declare const foo: DeepReadonly<Foo>;
```

##### `DeepRequired`

Makes all properties in `T` required recursively.

```ts
type Foo = Set<{ bar?: Array<Promise<{ baz?: string }>> }>;

// Set<{ bar: Promise<{ baz: string }>[] }>
declare const foo: DeepRequired<Foo>;
```

##### `RequiredExcept`

Makes all properties in `T` required except for the ones specified in `K`.

```ts
interface Foo {
	bar?: string;
	baz?: number;
}

// { bar?: string; baz: number }
declare const foo: RequiredExcept<Foo, 'bar'>;
```

##### `PartialRequired`

Makes all properties in `T` that are assignable to `K` required.

```ts
interface Foo {
	bar?: string;
	baz?: number;
}

// { bar: string; baz?: number }
declare const foo: PartialRequired<Foo, 'bar'>;
```

##### `ArgumentTypes`

Extracts the argument types of a function type.

```ts
type Foo = (bar: string, baz: number) => void;

// [string, number]
declare const foo: ArgumentTypes<Foo>;
```

##### `Arr`

A type that represents a readonly array of `any`.

```ts
// readonly any[]
declare const arr: Arr;
```

##### `Ctor`

A constructor with parameters.

```ts
// new (...args: any[]) => any
declare const foo: Ctor;

// new (...args: [string, number]) => SomeClass
declare const bar: Ctor<[string, number], SomeClass>;
```

##### `AbstractCtor`

An abstract constructor with parameters.

```ts
// abstract new (...args: any[]) => any
declare const foo: AbstractCtor;

// abstract new (...args: [string, number]) => SomeClass
declare const bar: AbstractCtor<[string, number], SomeClass>;
```

##### `Constructor`

A constructor without parameters.

```ts
// new (...args: any[]) => any
declare const foo: Constructor;

// new (...args: any[]) => SomeClass
declare const bar: Constructor<SomeClass>;
```

##### `AbstractConstructor`

An abstract constructor without parameters.

```ts
// abstract new (...args: any[]) => any
declare const foo: AbstractConstructor;

// abstract new (...args: any[]) => SomeClass
declare const bar: AbstractConstructor<SomeClass>;
```

##### `FirstArgument`

Extracts the first argument of a function type.

```ts
type Foo = (bar: string, baz: number) => void;

// string
declare const foo: FirstArgument<Foo>;
```

##### `SecondArgument`

Extracts the second argument of a function type.

```ts
type Foo = (bar: string, baz: number) => void;

// number
declare const foo: SecondArgument<Foo>;
```

##### `Awaitable`

A type that represents a value or a promise of a value. Useful for functions that can accept both promises and non-promises.

```ts
// string | Promise<string>
declare const foo: Awaitable<string>;
```

##### `Nullish`

A type that represents `null` or `undefined`.

```ts
// null | undefined
declare const foo: Nullish;
```

##### `NonNullableProperties`

Removes all properties of `T` that are not `null` or `undefined`.

```ts
interface Foo {
	foo: null;
	bar: undefined;
	baz: boolean;
}

// { baz: boolean }
declare const foo: NonNullableProperties<Foo>;
```

##### `PrettifyObject`

An utility type that fuses intersections of objects.

```ts
type Objects = {
	foo: string;
	bar: number;
} & {
	hello: boolean;
	world: bigint;
};
type PrettyObjects = PrettifyObject<Objects>;
// {
//   foo: string;
//   bar: number;
//   hello: boolean;
//   world: bigint
// }
```

##### `PickByValue`

Picks keys from `T` who's values are assignable to `V`.

```ts
interface Foo {
	foo: string;
	bar: number;
	baz: boolean;
}

// 'foo' | 'bar'
declare const foo: PickByValue<Foo, string | number>;
```

##### `Mutable`

Makes all properties in `T` mutable.

```ts
interface Foo {
	readonly bar: string;
	readonly baz: Array<[readonly number]>;
}

// { bar: string; baz: number[] }
declare const foo: Mutable<Foo>;
```

##### `StrictRequired`

Makes all properties in `T` strictly required by removing `undefined` and `null` from value types.

```ts
interface Foo {
	bar: string | undefined;
	baz?: number | null;
}

// { bar: string; baz: number }
declare const foo: StrictRequired<Foo>;
```

##### `ArrayElementType`

Gets a union type of all the keys that are in an array.

```ts
const sample = [1, 2, '3', true];

// string | number | boolean
declare const foo: ArrayElementType<typeof sample>;
```

/**
 * Represents a type that can be bound to.
 * This includes strings, symbols, functions, and objects.
 */
// eslint-disable-next-line ts/no-unsafe-function-type -- native bindings
export type Bindable = string | symbol | Function | object;

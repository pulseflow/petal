/**
 * ReturnType for a function that can return either a value or a `Promise` with that value
 */
export type Awaitable<Type> = PromiseLike<Type> | Type;

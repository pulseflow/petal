/**
 * Represents a type that is the union of the values of an object `T`.
 */
export type ValueOf<T> = T[keyof T];

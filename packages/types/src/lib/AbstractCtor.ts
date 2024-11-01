import type { AnyReadonlyArray } from './AnyReadonlyArray';

/**
 * A generic abstract constructor with parameters
 */
export type AbstractCtor<Args extends AnyReadonlyArray = readonly any[], Constructable = any> = abstract new (...args: Args) => Constructable;

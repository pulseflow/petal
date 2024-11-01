import type { AnyReadonlyArray } from './AnyReadonlyArray';

/**
 * A generic constructor with parameters
 */
export type Ctor<Args extends AnyReadonlyArray = AnyReadonlyArray, Constructable = unknown> = new (...args: Args) => Constructable;

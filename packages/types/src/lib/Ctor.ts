import type { AnyReadonlyArray } from './AnyReadonlyArray';

/**
 * A generic constructor with parameters
 */
export type Ctor<Args extends AnyReadonlyArray = AnyReadonlyArray, Constructable = any> = new (...args: Args) => Constructable;

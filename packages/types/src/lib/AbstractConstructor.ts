/**
 * A generic abstract constructor without parameters
 */
export type AbstractConstructor<Constructable> = abstract new (...args: any[]) => Constructable;

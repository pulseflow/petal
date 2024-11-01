/**
 * A generic constructor without parameters
 */
export type Constructor<Constructable = unknown> = new (...args: unknown[]) => Constructable;

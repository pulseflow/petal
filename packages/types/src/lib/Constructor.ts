/**
 * A generic constructor without parameters
 */
export type Constructor<Constructable = any> = new (...args: any[]) => Constructable;

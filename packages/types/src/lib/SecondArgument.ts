/**
 * Gets the second argument of any given function
 */
export type SecondArgument<Function> = Function extends (arg1: unknown, arg2: infer Second, ...args: unknown[]) => unknown ? Second : unknown;

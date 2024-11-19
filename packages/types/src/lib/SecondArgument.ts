/**
 * Gets the second argument of any given function
 */
export type SecondArgument<Function> = Function extends (arg1: any, arg2: infer Second, ...args: any[]) => any ? Second : any;

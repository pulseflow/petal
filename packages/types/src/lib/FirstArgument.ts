/**
 * Gets the first argument of any given function
 */
export type FirstArgument<Function> = Function extends (arg1: infer First, ...args: any[]) => any ? First : any;

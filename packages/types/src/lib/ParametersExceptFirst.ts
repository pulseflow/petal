export type ParametersExceptFirst<Arguments> = Arguments extends (arg0: any, ...rest: infer Rest) => any ? Rest : never;

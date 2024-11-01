export type ArgumentTypes<F extends (...args: unknown[]) => unknown> = F extends (...args: infer A) => unknown ? A : never;

export type Rename<Object, From extends keyof Object, To extends string> = Omit<Object, From> & Record<To, Object[From]>;

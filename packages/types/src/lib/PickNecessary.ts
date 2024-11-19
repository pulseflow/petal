export type PickNecessary<Type> = Pick<Type, { [Key in keyof Type]-?: unknown extends Pick<Type, Key> ? never : Key; }[keyof Type]>;

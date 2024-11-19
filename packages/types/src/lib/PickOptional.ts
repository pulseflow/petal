export type PickOptional<Type> = Pick<Type, { [Key in keyof Type]-?: unknown extends Pick<Type, Key> ? Key : never; }[keyof Type]>;

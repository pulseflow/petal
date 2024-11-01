export type PartialRequired<Type, Key extends keyof Type> = Partial<Omit<Type, Key>> & Required<Pick<Type, Key>>;

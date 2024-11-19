export type OptionalExcept<Type, Key extends keyof Type> = Partial<Omit<Type, Key>> & Required<Pick<Type, Key>>;

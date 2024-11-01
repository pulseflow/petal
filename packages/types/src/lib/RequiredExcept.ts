export type RequiredExcept<Type, Key extends keyof Type> = Partial<Pick<Type, Key>> & Required<Omit<Type, Key>>;

export type ExtractKeysByType<Type, Keys> = {
	[Key in Extract<keyof Type, string>]: Type[Key] extends Keys ? Key : never;
} [Extract<keyof Type, string>];

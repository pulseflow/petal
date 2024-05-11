import { Flag } from './flag';
import type { Flags, UnknownOptionFlag } from './flag';

export type OptionFlags = Record<string, UnknownOptionFlag>;

export function parseOptions<T extends OptionFlags>(optionFlags: T) {
	const flagList = (Object.entries(optionFlags)).map(([k, v]) => [k, new Flag(k, v)] as const);
	const flagDict = Object.fromEntries(flagList);

	return [flagDict as Flags<T>, flagList] as const;
}

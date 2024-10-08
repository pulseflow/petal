import type { Flags, FlagType, UnknownOptionFlag } from './flag';
import { Flag } from './flag';

export type OptionFlags = Record<string, UnknownOptionFlag>;
type ParsedOptions<T extends OptionFlags> = readonly [Flags<T>, (readonly [string, Flag<string, FlagType, boolean, string | number | boolean | (string | number | boolean)[] | undefined>])[]];

export function parseOptions<T extends OptionFlags>(optionFlags: T): ParsedOptions<T> {
	const flagList = (Object.entries(optionFlags)).map(([k, v]) => [k, new Flag(k, v)] as const);
	const flagDict = Object.fromEntries(flagList);

	return [flagDict as Flags<T>, flagList] as const;
}

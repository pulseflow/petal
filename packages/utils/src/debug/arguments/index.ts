import { parseInput } from './input';
import { parseOptions } from './options';
import type { Aliases, OptionFlag, ParsedFlags } from './flag';
import type { OptionFlags } from './options';

export function parseArgs<T extends OptionFlags>(args: string[], optionFlags: T): readonly [string[], ParsedFlags<T>] {
	const [flags, flagList] = parseOptions(optionFlags);
	const aliases = flagList.reduce((acc, [k, v]) => {
		if (!v.options.short)
			return acc;
		(acc as any)[v.options.short] = k;
		return acc;
	}, {} as Aliases<T>);

	const [outArgs, outFlags] = parseInput(args, flags, aliases, []);

	for (const [name, flag] of flagList)
		if (!outFlags[name])
			(outFlags as any)[name] = flag.fallback();

	return [outArgs, outFlags as ParsedFlags<T>] as const;
}

export type { OptionFlag };
export * from './flag';

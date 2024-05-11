import type { Aliases, Flags, OuterFlagType, ParsedFlags, UnknownOptionFlag } from './flag';

export function parseInput<T extends Record<string, UnknownOptionFlag>>(
	args: string[],
	flags: Flags<T>,
	aliases: Aliases<T>,
	outArgs: string[],
	outFlags: Partial<ParsedFlags<T>> = {},
	state?: keyof T,
): [typeof outArgs, Partial<ParsedFlags<T>>] {
	type F = T[NonNullable<typeof state>];
	type FOut = OuterFlagType<F['type'], F['array']> | undefined;

	if (args.length === 0) {
		if (state) {
			const flag = flags[state];
			outFlags[state] = flag.match(outFlags[state] as FOut) as any;
		}

		return [outArgs, outFlags];
	}

	const [arg, ...rest] = args;

	if (!state) {
		if (arg.startsWith('-')) {
			const [_name, value] = arg.split('=') as [string, string | undefined];

			if (value)
				rest.unshift(value);

			const name = _name.startsWith('--') ? _name.slice(2) : _name.slice(1);
			const alias = aliases[name];
			const flag = flags[name] ?? flags[alias];
			if (!flag) {
				return parseInput(
					rest,
					flags,
					aliases,
					[...outArgs, _name],
					outFlags,
				);
			}

			return parseInput(rest, flags, aliases, outArgs, outFlags, flag.name);
		}

		return parseInput(rest, flags, aliases, [...outArgs, arg], outFlags);
	}

	const flag = flags[state];

	if (flag.is(arg)) {
		outFlags[state] = flag.upsert(arg, outFlags[state] as FOut) as any;
	}
	else {
		outFlags[state] = flag.match(outFlags[state] as FOut) as any;
		rest.unshift(arg);
	}

	return parseInput(rest, flags, aliases, outArgs, outFlags);
}

/* eslint-disable no-console */
import process from 'node:process';
import util from 'node:util';

import type { FunctionVoid, Key } from '../../index.js';
import { M, get_dimension, graphemes } from '../../index.js';
import { informScope, informSymbol, tablePadding } from './config.js';
import { LogLevel, modifiers, noop } from './types.js';
import type { Modifier, Options } from './types.js';
import { bg, c } from './utils.js';

export function log(_opts: Options, ...scopes: string[]) {
	const opts = { ..._opts };
	informScope(...scopes);

	const print = (
		_symbol: string,
		color: string,
		level: LogLevel,
		mod?: Modifier,
		align = false,
		col_bg?: string,
		col_fg?: string,
	) => {
		informSymbol(_symbol);

		return (...args: any[]) => {
			const scope_data = informScope(...scopes);
			const symbol = informSymbol(_symbol);
			const columns = process.stdout.columns;
			const maxLen = columns - scope_data.length - graphemes(symbol);

			const break_char = (s: string, n: number) =>
				s.match(new RegExp(`.{1,${n}}`, 'g')) ?? [];

			const break_item = (items: string[], n: number) => {
				if (items.length === 0)
					return [];

				const tail = items.splice(1);

				while (tail.length > 0) {
					const item = tail.shift()!;

					const last = items.pop()!;
					const joint = `${last} ${item}`;
					joint.length <= n ? items.push(joint) : items.push(last, item);
				}

				return items;
			};

			const inspect = (v: any) => typeof v === 'string' ? v : util.inspect(v);

			const unaligned = () => {
				const inspected = args.map(inspect);

				return inspected.some(item => item.length > maxLen || item.includes('\n'))
					? break_char(inspected.join(' ').trimEnd(), maxLen)
					: break_item(inspected, maxLen);
			};

			const aligned = () => {
				const dim = get_dimension(args);
				if (args.length === 0 || dim < 2)
					return unaligned();

				const _records = (dim === 2 ? args : args.flat(1)) as any[][];
				const records = _records.map(r => r.map(inspect));

				const cols = records[0].length;

				if (records.some(record => record.length !== cols))
					throw new Error('All records must have the same length');

				const colsLen = records.reduce((acc, cur) => {
					return cur.map((v, i) => Math.max(acc[i], graphemes(v)));
				}, Array(cols).fill(0));

				const padding = tablePadding();

				const paddingLen = graphemes(padding) * (cols - 1);
				const totalLen = colsLen.reduce((acc, cur) => acc + cur, 0)
					+ paddingLen;

				if (totalLen <= maxLen) {
					return records.map(r =>
						r
							.map((v, i) => v.padEnd(colsLen[i], ' '))
							.join(padding),
					);
				}

				let lenPool = maxLen - paddingLen;
				const averageLen = Math.floor(lenPool / cols);

				const individualLen = Array(cols).fill(0);

				colsLen.forEach((len, i) => {
					if (len <= averageLen) {
						individualLen[i] = len;
						lenPool -= len;
					}
				});

				const remTotalLen = colsLen.reduce((acc, len) => {
					if (len > averageLen)
						return acc + len;
					return acc;
				}, 0);

				const remLenPool = lenPool;

				let highestLen = 0;
				let highestLenIndex = 0;

				colsLen.forEach((len, i) => {
					if (len > averageLen) {
						individualLen[i] = Math.floor(remLenPool * (len / remTotalLen));
						lenPool -= individualLen[i];

						if (len > highestLen) {
							highestLen = len;
							highestLenIndex = i;
						}
					}
				});

				if (lenPool > 0)
					individualLen[highestLenIndex] += lenPool;

				const chunked = records.map(r =>
					r.map((v, i) => break_char(v, individualLen[i])),
				);

				const out: string[] = [];

				for (const line of chunked) {
					const maxLines = Math.max(...line.map(l => l.length));

					for (let i = 0; i < maxLines; i++) {
						const row = line
							.map(l => l[i] ?? '')
							.map((v, i) => v.padEnd(individualLen[i], ' ')).join(padding);

						out.push(row);
					}
				}

				return out;
			};

			const lines = align ? aligned() : unaligned();

			if (align && lines.length === 0)
				return;

			const [head, ...tail] = lines.map(line => line.padEnd(maxLen, ' '));

			const fmt = (color: string) => `color: ${color}; background-color: ${bg(mod, col_bg)};`;

			const emit = (lev: string) => {
				const e = new Set<string>();

				switch (lev) {
					case 'trace':
					case 'verbose':
						e.add('trace');
						e.add('verbose');
						break;
					case 'debug':
						e.add('debug');
						break;
					case 'info':
						e.add('info');
						break;
					case 'warn':
						e.add('warn');
						break;
					case 'error':
						e.add('error');
						break;
					default:
				}

				return e;
			};

			const textColors = {
				[LogLevel.Verbose]: c('overlay0'),
				[LogLevel.Trace]: c('overlay0'),
				[LogLevel.Debug]: c('overlay0'),
				[LogLevel.Info]: c('text'),
				[LogLevel.Warn]: c('yellow'),
				[LogLevel.Error]: c('red'),
				[LogLevel.Success]: c('green'),
			};

			const con = (lev: string, native = lev) => (env: string) =>
				emit(env).has(lev)
					? (console as any as Record<string, FunctionVoid>)[native]
					: noop;

			const fn = {
				[LogLevel.Verbose]: con('trace', 'debug'),
				[LogLevel.Trace]: con('trace'),
				[LogLevel.Debug]: con('debug'),
				[LogLevel.Info]: con('info'),
				[LogLevel.Warn]: con('warn'),
				[LogLevel.Error]: con('error'),
				[LogLevel.Success]: con('info'),
			};

			const _io = fn[level]((process.env.LOG_LEVEL) ?? 'info') ?? console.log;

			const io = (_strings: TemplateStringsArray, ...args: string[]) => {
				_io(
					args.map(a => `%c${a}`).join(''),
					fmt(color),
					fmt(col_fg ?? textColors[level]),
					fmt(c('surface0')),
					fmt(c('surface1')),
					fmt(c('surface2')),
				);
			};

			const {
				primary,
				delim,
				rest,
				pad,
			} = scope_data;
			let { secondary } = scope_data;
			secondary &&= secondary + delim;

			const tertiary = pad + (rest.length > 0 ? rest.join(delim) + delim : '');

			io`${symbol} ${head} ${tertiary} ${secondary} ${primary}`;

			tail.forEach((line) => {
				const _symbol = ' '.repeat(graphemes(symbol));
				const _s1 = ' '.repeat(graphemes(primary));
				const _s2 = ' '.repeat(graphemes(secondary));
				const _s3 = ' '.repeat(graphemes(tertiary));
				io`${_symbol} ${line} ${_s3} ${_s2} ${_s1}`;
			});
		};
	};

	const _print = (
		s: string,
		c: string,
		l: LogLevel,
		bg?: string,
		fg?: string,
	) => print(s, c, l, opts.mod, opts.align, bg, fg);

	const variants = new M()
		.set('error', _print('󰈸', c('red'), LogLevel.Error))
		.set('warn', _print('󱐋', c('peach'), LogLevel.Warn))
		.set('debug', _print('·', c('overlay2'), LogLevel.Debug))
		.set('verbose', _print(' ', c('overlay2'), LogLevel.Verbose))
		.set('trace', _print(' ', c('overlay2'), LogLevel.Trace))
		.set('info', _print('•', c('blue'), LogLevel.Info))
		.set('start', _print('󰮷', c('mauve'), LogLevel.Info))
		.set('progress', _print('•', c('overlay2'), LogLevel.Info, c(), c('overlay2')))
		.set('finish', _print('󰮽', c('green'), LogLevel.Info))
		.set('launch', _print('󱓞', c('mauve'), LogLevel.Info))
		.set('success', _print('󰄬', c('green'), LogLevel.Info))
		.set('tilde', _print('󰜥', c('peach'), LogLevel.Debug))
		.set('plus', _print('󰐕', c('green'), LogLevel.Debug))
		.set('minus', _print('󰍴', c('red'), LogLevel.Debug))
		.set('equal', _print('󰇼', c('blue'), LogLevel.Debug))
		.set('unequal', _print('󰦎', c('peach'), LogLevel.Debug))
		.set('added', _print('', c('green', 50, 'overlay0'), LogLevel.Debug, c(), c('green', 20, 'overlay0')))
		.set('removed', _print('', c('red', 50, 'overlay0'), LogLevel.Debug, c(), c('red', 20, 'overlay0')))
		.set('modified', _print('', c('blue', 50, 'overlay0'), LogLevel.Debug, c(), c('blue', 20, 'overlay0')))
		.set('ignored', _print('', c('subtext0', 50, 'overlay0'), LogLevel.Debug));

	type Variant = Key<typeof variants>;

	type Logger =
		& {
			[K in Variant]: FunctionVoid;
		}
		& {
			aligned: Logger;
			custom: typeof _print;
			extend: (...scopes: string[]) => Logger;
		}
		& {
			[K in Modifier]: Logger;
		}
		& FunctionVoid;

	const obj = {};

	Object.defineProperty(obj, 'extend', {
		value: (...sub_scopes: string[]) => log(opts, ...scopes, ...sub_scopes),
	});

	const handler: ProxyHandler<any> = {
		get: (target, prop) => {
			if (typeof prop !== 'string')
				return target[prop];

			if (variants.has(prop))
				return variants.get(prop as Variant);
			if (prop === 'aligned')
				return log({ ...opts, align: true }, ...scopes);
			if (modifiers.has(prop as Modifier))
				return log({ ...opts, mod: prop as Modifier }, ...scopes);

			if (prop === 'custom')
				return _print;

			return target[prop];
		},

		apply: (_target, _thisArg, args) => {
			return variants.get('info')(...args);
		},
	};

	return new Proxy(obj, handler) as Logger;
}

/* eslint-disable no-console */
import process from 'node:process';
import util from 'node:util';

import type { ColorName } from '@catppuccin/palette';
import type { FunctionVoid, Key } from '../../index';
import { M, get_dimension, graphemes } from '../../index';
import { pad_table_grid, reg_scope, reg_symbol } from './config';
import { LogLevel, modifiers, noop } from './types';
import type { BackgroundModifier, Options } from './types';
import { bg, c, textColors } from './utils';

export function log(_opts: Options, ...scopes: string[]) {
	const opts = { ..._opts };
	reg_scope(...scopes);

	function print(
		level: LogLevel,
		symbol: string,
		align = false,
		col_symbol = c('overlay0'),
		col_fg = textColors[level],
		col_bg?: BackgroundModifier,
	) {
		reg_symbol(symbol);

		return (...args: any[]) => {
			const scope_data = reg_scope(...scopes);
			const symbol_padded = reg_symbol(symbol);
			const columns = process.stdout.columns;
			const maxLen = columns - scope_data.length - graphemes(symbol_padded);

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

				const padding = pad_table_grid();

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

			const fmt = (color: string) => `color: ${color}; background-color: ${bg(col_bg)};`;

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
					fmt(col_symbol),
					fmt(col_fg),
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

			io`${symbol_padded} ${head} ${tertiary} ${secondary} ${primary}`;

			tail.forEach((line) => {
				const _symbol = ' '.repeat(graphemes(symbol_padded));
				const _s1 = ' '.repeat(graphemes(primary));
				const _s2 = ' '.repeat(graphemes(secondary));
				const _s3 = ' '.repeat(graphemes(tertiary));
				io`${_symbol} ${line} ${_s3} ${_s2} ${_s1}`;
			});
		};
	};

	const wrap = (
		lev: LogLevel,
		sym: string = '',
		c_sym: string = c(),
		c_fg?: string,
	) => print(lev, sym, opts.align, c_sym, c_fg, opts.mod);

	const wrap_with = (lev: LogLevel, o_sym = 100, o_fg = 100) =>
		(sym?: string, c_sym?: ColorName, c_fg?: ColorName) =>
			wrap(lev, sym, c(c_sym, o_sym), c_fg && c(c_fg, o_fg, 'overlay0'));

	const E = wrap_with(LogLevel.Error);
	const W = wrap_with(LogLevel.Warn);
	const D = wrap_with(LogLevel.Debug, 50, 20);
	const V = wrap_with(LogLevel.Verbose);
	const T = wrap_with(LogLevel.Trace);
	const I = wrap_with(LogLevel.Info);

	const variants = new M()
		.set('error', E('󰈸', 'red'))
		.set('warn', W('󱐋', 'peach'))
		.set('info', I('•', 'blue'))
		.set('raw', I())
		.set('start', I('󰮷', 'mauve'))
		.set('progress', I('•', 'overlay2', 'overlay2'))
		.set('finish', I('󰮽', 'green'))
		.set('launch', I('󱓞', 'mauve'))
		.set('success', I('󰄬', 'green'))
		.set('insert', I('󰐕', 'green'))
		.set('delete', I('󰍴', 'red'))
		.set('match', I('󰇼', 'blue'))
		.set('mismatch', I('󰦎', 'peach'))
		.set('debug', D('·', 'overlay2'))
		.set('tilde', D('󰜥', 'peach'))
		.set('plus', D('󰐕', 'green'))
		.set('minus', D('󰍴', 'red'))
		.set('equal', D('󰇼', 'blue'))
		.set('unequal', D('󰦎', 'peach'))
		.set('question', D('?', 'subtext0'))
		.set('answer', D('󰇼', 'blue'))
		.set('added', D('', 'green', 'green'))
		.set('removed', D('', 'red', 'red'))
		.set('modified', D('', 'blue', 'blue'))
		.set('ignored', D('', 'subtext0'))
		.set('verbose', V(' ', 'overlay2'))
		.set('trace', T(' ', 'overlay2'));

	type Variant = Key<typeof variants>;

	const custom_aliases = {
		err: E,
		warn: W,
		info: I,
		dbg: D,
		verb: V,
		trc: T,
	};

	type Level = keyof typeof custom_aliases;

	function custom(level: Level, sym?: string, c_sym?: ColorName, c_fg?: ColorName) {
		return custom_aliases[level](sym, c_sym, c_fg);
	}

	type Logger =
		& {
			[K in Variant]: FunctionVoid;
		}
		& {
			aligned: Logger;
			custom: typeof custom;
			extend: (...scopes: string[]) => Logger;
		}
		& {
			[K in BackgroundModifier]: Logger;
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
			if (modifiers.has(prop as BackgroundModifier))
				return log({ ...opts, mod: prop as BackgroundModifier }, ...scopes);

			if (prop === 'custom')
				return custom;

			return target[prop];
		},

		apply: (_target, _thisArg, args) => {
			return variants.get('info')(...args);
		},
	};

	return new Proxy(obj, handler) as Logger;
}

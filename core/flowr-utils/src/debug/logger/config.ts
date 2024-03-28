import { graphemes } from '../../index.js';

export interface ScopeData {
	primary: string;
	secondary: string;
	rest: string[];
	delim: string;
	length: number;
	pad: string;
	total: number;
}

const scope_delim = ':';
let len_scope_max = 0;
let pad_scope = 2;
let len_sym_max = 0;
let pad_sym = 2;
let pad_tab = 2;
let pad_start = 1;
let pad_end = 1;

export function reg_scope(...scopes: string[]): ScopeData {
	if (scopes.length === 0)
		scopes.push('main');
	const len_scope_cur = scopes.reduce((acc, cur) => acc + graphemes(cur), 0)
		+ (scopes.length - 1) * graphemes(scope_delim);
	len_scope_max = Math.max(len_scope_max, len_scope_cur);

	return {
		total: scopes.length,
		length: pad_scope + len_scope_max + pad_end,
		primary: scopes.shift()! + ' '.repeat(pad_end),
		secondary: scopes.shift() ?? '',
		rest: scopes.reverse(),
		pad: ' '.repeat(len_scope_max - len_scope_cur + pad_scope),
		delim: scope_delim,
	};
}

export function reg_symbol(symbol: string): string {
	len_sym_max = Math.max(len_sym_max, graphemes(symbol));
	return ' '.repeat(pad_start) + symbol.padEnd(len_sym_max, ' ') + ' '.repeat(pad_sym);
}

export function pad({
	scope = pad_scope,
	symbol = pad_sym,
	table = pad_tab,
	start = pad_start,
	end = pad_end,
}) {
	pad_scope = scope;
	pad_sym = symbol;
	pad_tab = table;
	pad_start = start;
	pad_end = end;
}

export function pad_table_grid() {
	return ' '.repeat(pad_tab);
}

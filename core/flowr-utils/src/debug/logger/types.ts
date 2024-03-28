import type { ColorName as CatColorName } from '@catppuccin/palette';
import type { ColorName as ChalkColorName } from 'chalk';

import type { FunctionVoid } from '../../types.js';

export enum LogLevel {
	Verbose = 'verbose',
	Trace = 'trace',
	Debug = 'debug',
	Info = 'info',
	Warn = 'warn',
	Error = 'error',
	Success = 'success',
}

export interface Options {
	align: boolean;
	mod?: BackgroundModifier;
}

export type PetalColorName = CatColorName | ChalkColorName;

export const noop: FunctionVoid = (..._args) => {};
export const _modifiers = ['brightest', 'brighter', 'bright', 'dark', 'darker', 'darkest'] as const;
export const modifiers = new Set(_modifiers);
export type BackgroundModifier = typeof _modifiers[number];

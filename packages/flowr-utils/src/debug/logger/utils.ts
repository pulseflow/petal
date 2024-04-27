import { type ColorName, flavors } from '@catppuccin/palette';
import tc2 from 'tinycolor2';
import { type BackgroundModifier, LogLevel } from './types';

export function c(color: ColorName = 'base', opacity = 100, base: ColorName = 'base') {
	const { hex } = flavors.mocha.colors[color];
	const { hex: base_hex } = flavors.mocha.colors[base];

	return `#${tc2.mix(hex, base_hex, 100 - opacity).toHex()}`;
}

export const textColors = {
	[LogLevel.Verbose]: c('overlay0'),
	[LogLevel.Trace]: c('overlay0'),
	[LogLevel.Debug]: c('overlay0'),
	[LogLevel.Info]: c('text'),
	[LogLevel.Warn]: c('yellow'),
	[LogLevel.Error]: c('red'),
	[LogLevel.Success]: c('green'),
};

export function bg(modifier?: BackgroundModifier, default_color?: string) {
	switch (modifier) {
		case 'brightest':
			return c('surface2');
		case 'brighter':
			return c('surface1');
		case 'bright':
			return c('surface0');
		case 'dark':
			return c('mantle');
		case 'darker':
			return c('crust');
		case 'darkest':
			return '#000000';
		default:
			return default_color ?? c('base');
	}
}

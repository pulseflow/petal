import { type ColorName, flavors } from '@catppuccin/palette';
import tc2 from 'tinycolor2';
import type { Modifier } from './types.js';

export function c(color: ColorName = 'base', opacity = 100, base: ColorName = 'base') {
	const { hex } = flavors.mocha.colors[color];
	const { hex: base_hex } = flavors.mocha.colors[base];

	return `#${tc2.mix(hex, base_hex, 100 - opacity).toHex()}`;
}

export function bg(modifier?: Modifier, default_color?: string) {
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

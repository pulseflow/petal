import type { TypedFlatConfigItem } from '../types/index.ts';
import createCommand from 'eslint-plugin-command/config';

export async function command(): Promise<TypedFlatConfigItem[]> {
	return [
		{
			...createCommand(),
			name: 'petal/command/rules',
		},
	];
}

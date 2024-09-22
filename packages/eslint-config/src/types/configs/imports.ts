import type { TsResolverOptions } from 'eslint-plugin-import-x/types.js';
import type { OptionsOverrides } from './overrides';
import type { OptionsStylistic } from './stylistic';
import type { OptionsHasTypeScript } from './typescript';

export interface OptionsImports extends OptionsStylistic, OptionsOverrides, OptionsHasTypeScript {
	tsResolverOptions?: Pick<TsResolverOptions, 'alwaysTryTypes' | 'project'>;
};

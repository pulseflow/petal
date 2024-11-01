import type { Linter } from 'eslint';
import type { TypedFlatConfigItem } from '../src';

((): Linter.Config => ({} as TypedFlatConfigItem))();
((): TypedFlatConfigItem => ({} as Linter.Config))();

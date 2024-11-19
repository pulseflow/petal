import { createTsupConfig } from '../scripts/tsup.config.ts';

export default createTsupConfig('eslint', { iife: { disabled: true } });

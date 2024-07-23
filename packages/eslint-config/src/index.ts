/**
 * General purpose ESLint configuration for Petal and the Petal standard.
 *
 * @module
 */

export * from './configs';
export * from './factory';
export * from './globs';
export * from './utils';

export type * from './types';

export { defineConfig as default } from './factory';

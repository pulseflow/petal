/**
 * General purpose ESLint configuration for Petal and the Petal standard.
 *
 * @module
 */

export * from './configs/index.ts';
export * from './factory.ts';
export { defineConfig as default } from './factory.ts';
export * from './globs.ts';

export type * from './types/index.ts';
export * from './utils.ts';

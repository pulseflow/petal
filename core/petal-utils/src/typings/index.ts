/**
 * Common TypeScript types used within Petal
 *
 * @packageDocumentation
 */

export type {
	JsonArray,
	JsonObject,
	JsonPrimitive,
	JsonValue,
} from './json.js';
export type { Observable, Observer, Subscription } from './observable.js';
export { type HumanDuration, durationToMilliseconds } from './time.js';

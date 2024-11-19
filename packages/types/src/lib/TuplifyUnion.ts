import type { LastOf } from './LastOf.ts';
import type { PushArray } from './PushArray.ts';

/**
 * @description THIS IS A BAD IDEA. ONLY USE THIS IF YOU KNOW WHAT YOU'RE DOING.
 * @copyright CC BY-SA 4.0 https://stackoverflow.com/a/55128956
 */
export type TuplifyUnion<Type, LastElement = LastOf<Type>, ShouldPush = [Type] extends [never] ? true : false> = true extends ShouldPush ? [] : PushArray<TuplifyUnion<Exclude<Type, LastElement>>, LastElement>;

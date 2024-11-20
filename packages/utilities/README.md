# @flowr/utilities

**Opinionated collection of common TypeScript utilities**

## Installation

You can use the following command to install this package, or replace `pnpm add` with your package manager of choice.

```sh
pnpm add -D @flowr/utilities
```

---

## Usage

You can import individual utility function from subpath like: `@flowr/utilities/isFunction` or the entire library.

```ts
import { isFunction } from '@flowr/utilities';
/* alternatively... */
import { isFunction } from '@flowr/utilities/isFunction';
```

### Documentation

#### `arrayStrictEquals`

Compares if two arrays are strictly equal.

```ts
arrayStrictEquals([1, 2, 3], [1, 2, 3]); // true
arrayStrictEquals([1, 2, 3], [1, 2, 3, 4]); // false
arrayStrictEquals([1, 2, 3], [1, 2, 4]); // false
```

#### `asyncQueue`

Sequential asynchronous lock-based queue for promises.

```ts
const queue = new AsyncQueue();

async function request(url, options) {
	// Wait and lock the queue
	await queue.wait();

	try {
		// Perform the operation sequentially
		return await fetch(url, options);
	}
	finally {
		// Unlock the next promise in the queue
		queue.shift();
	}
}

request(someUrl1, someOptions1);
// Will call fetch() immediately

request(someUrl2, someOptions2);
// Will call fetch() after the first finished

request(someUrl3, someOptions3);
// Will call fetch() after the second finished
```

#### `chunk`

Splits up an array into chunks.

```ts
chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
chunk([1, 2, 3, 4, 5], 3); // [[1, 2, 3], [4, 5]]
```

#### `classExtends`

Checks whether or not the value class extends the base class.

```ts
class A {}
class B extends A {}

classExtends(A, B); // false
classExtends(B, A); // true
```

#### `codeBlock`

Wraps text in a markdown codeblock with a language indicator for syntax highlighting.

````ts
codeBlock('js', 'const value = "Hello World!";'); // ```js\nconst value = "Hello World!";\n```
````

#### `cutText`

Split a text by its latest space character in a range from the character 0 to the selected one.

```ts
cutText('Lorem Ipsum', 9); // "Lorem..."
```

#### `deepClone`

Deep clones an object.

```ts
const obj = { a: 1, b: { c: 2 } };
const clone = deepClone(obj); // { a: 1, b: { c: 2 } }
```

#### `duration`

Duration management utilities.

##### Human Readable Milliseconds

Milliseconds are often hard for humans to quickly parse, so it's nice to use
named enum members to make it easier to read.

```typescript
setTimeout(() => {
	// Do something in half a second
}, Time.Second / 2 /* 500 */);

setTimeout(() => {
	// Do something in 6 hours
}, Time.Hour * 6 /* 21600000 */);

setTimeout(() => {
	// Do something in 1 day
}, Time.Day /* 86400000 */);
```

##### Parsing a Duration

```typescript
// Create a Duration from a string
new Duration('1d3h15m3s').offset; // 98103000
new Duration('1 day, 3h & 15m, some extra characters, and another 3 seconds').offset; // 98103000

// The date from now after the specified duration
new Duration('1d3h15m3s').fromNow;

// Or use a specific date
new Duration('1d3h15m3s').dateFrom(new Date('2020-01-01T00:00:00.000Z'));
```

<details>
	<summary>
		<b>Show all available tokens</b>
	</summary>

```typescript
new Duration('1 nanosecond').offset; // 0.000001
new Duration('2 nanoseconds').offset; // 0.000002
new Duration('1 ns').offset; // 0.000001

new Duration('1 millisecond').offset; // 1
new Duration('2 milliseconds').offset; // 2
new Duration('1 ms').offset; // 1

new Duration('1 second').offset; // 1000
new Duration('2 seconds').offset; // 2000
new Duration('1 sec').offset; // 1000
new Duration('2 secs').offset; // 2000
new Duration('1 s').offset; // 1000

new Duration('1 minute').offset; // 60000
new Duration('2 minutes').offset; // 120000
new Duration('1 min').offset; // 60000
new Duration('2 mins').offset; // 120000
new Duration('1 m').offset; // 60000

new Duration('1 hour').offset; // 3600000
new Duration('2 hours').offset; // 7200000
new Duration('1 hr').offset; // 3600000
new Duration('2 hrs').offset; // 7200000
new Duration('1 h').offset; // 3600000

new Duration('1 day').offset; // 86400000
new Duration('2 days').offset; // 172800000
new Duration('1 d').offset; // 86400000

new Duration('1 week').offset; // 604800000
new Duration('2 weeks').offset; // 1209600000
new Duration('1 wk').offset; // 604800000
new Duration('2 wks').offset; // 1209600000
new Duration('1 w').offset; // 604800000

new Duration('1 month').offset; // 2629800000
new Duration('2 months').offset; // 5259600000
new Duration('1 b').offset; // 2629800000
new Duration('2 mo').offset; // 5259600000

new Duration('1 year').offset; // 31557600000
new Duration('2 years').offset; // 63115200000
new Duration('1 yr').offset; // 31557600000
new Duration('2 yrs').offset; // 63115200000
new Duration('1 y').offset; // 31557600000
```

</details>

##### Serializing a Duration

```typescript
const formatter = new DurationFormatter();

// Serialize a duration
formatter.format(98103000); // 1 day 3 hours 15 minutes 3 seconds
formatter.format(-98103000); // -1 day 3 hours 15 minutes 3 seconds

// Serialize a duration with specified precision
formatter.format(98103000, 2); // 1 day 3 hours
```

##### Localizing with Durations

```typescript
// Create custom unit names
const units = {
	[TimeTypes.Year]: {
		1: 'año',
		DEFAULT: 'años'
	}
};

// Create a formatter the custom units
const formatter = new DurationFormatter(units);

// Serialize a duration
formatter.format(31557600000); // 1 año
formatter.format(63115200000); // 2 años
```

#### `filterNullAndUndefined`

Checks whether a value is not `null` nor `undefined`. This can be used in `Array#filter` to remove `null` and `undefined` from the array type

```ts
// TypeScript Type: (string | undefined | null)[]
const someArray = ['one', 'two', undefined, null, 'five'];

// TypeScript Type: string[]
const filteredArray = someArray.filter(filterNullAndUndefined); // ['one', 'two', 'five']
```

#### `filterNullAndUndefinedAndEmpty`

Checks whether a value is not `null`, `undefined`, or `''` (empty string). This can be used in `Array#filter` to remove `null`, `undefined`, and `''` from the array type

```ts
// TypeScript Type: (number | string | undefined | null)[]
const someArray = [1, 2, undefined, null, ''];

// TypeScript Type: number[]
const filteredArray = someArray.filter(filterNullAndUndefinedAndEmpty); // [1, 2]
```

#### `filterNullAndUndefinedAndZero`

Checks whether a value is not `null`, `undefined`, or `0`. This can be used in `Array#filter` to remove `null`, `undefined`, and `0` from the array type

```ts
// TypeScript Type: (string | number | undefined | null)[]
const someArray = ['one', 'two', undefined, null, 0];

// TypeScript Type: string[]
const filteredArray = someArray.filter(filterNullAndUndefinedAndZero); // ['one', 'two']
```

#### `getDeepObjectKeys`

Returns an array of all the keys of an object, including the keys of nested objects.

```ts
const obj = { a: 1, b: { c: 2 }, d: [{ e: 3 }] };
getDeepObjectKeys(obj); // ['a', 'b.c', 'd.0.e']
getDeepObjectKeys(obj, { arrayKeysIndexStyle: 'braces' }); // ['a', 'bc', 'd[0]e']
getDeepObjectKeys(obj, { arrayKeysIndexStyle: 'braces-with-dot' }); // ['a', 'b.c', 'd[0].e']
getDeepObjectKeys(obj, { arrayKeysIndexStyle: 'dotted' }); // ['a', 'b.c', 'd.0.e']
```

#### `hasAtLeastOneKeyInMap`

Checks whether a map has at least one of an array of keys.

```ts
const map = new Map([
	['a', 1],
	['b', 2],
	['c', 3]
]);

hasAtLeastOneKeyInMap(map, ['a', 'd']); // true
hasAtLeastOneKeyInMap(map, ['d', 'e']); // false
```

#### `inlineCodeBlock`

Wraps text in a markdown inline codeblock.

```ts
inlineCodeBlock('const value = "Hello World!";'); // `const value = "Hello World!";`
```

#### `isClass`

Verifies if the input is a class constructor.

```ts
class A {}

isClass(A); // true
isClass(() => {}); // false
```

#### `isFunction`

Verifies if the input is a function.

```ts
isFunction(() => {}); // true
isFunction('foo'); // false
```

#### `isNullOrUndefined`

Checks whether a value is `null` or `undefined`.

```ts
isNullOrUndefined(null); // true
isNullOrUndefined(undefined); // true
isNullOrUndefined(1); // false
```

#### `isNullOrUndefinedOrEmpty`

Checks whether a value is `null`, `undefined`, or `''` (empty string).

```ts
isNullOrUndefinedOrEmpty(null); // true
isNullOrUndefinedOrEmpty(undefined); // true
isNullOrUndefinedOrEmpty(''); // true
isNullOrUndefinedOrEmpty(1); // false
```

#### `isNullOrUndefinedOrZero`

Checks whether a value is `null`, `undefined`, or `0`.

```ts
isNullOrUndefinedOrZero(null); // true
isNullOrUndefinedOrZero(undefined); // true
isNullOrUndefinedOrZero(0); // true
isNullOrUndefinedOrZero(1); // false
```

#### `isNumber`

Verifies if the input is a number.

```ts
isNumber(1); // true
isNumber('1'); // false
```

#### `isObject`

Verifies if the input is an object.

```ts
isObject({}); // true
isObject([]); // true
isObject('foo'); // false
```

#### `isPrimitive`

Verifies if the input is a primitive.

```ts
isPrimitive(1); // true
isPrimitive('1'); // true
isPrimitive({}); // false
```

#### `isThenable`

Verifies if an object is a promise.

```ts
isThenable({}); // false
isThenable(Promise.resolve()); // true
```

#### `lazy`

Lazily creates a constant or load a module and caches it internally.

```ts
let timesCalled = 0;
const lazyValue = lazy(() => {
	timesCalled++;
	return 'foo';
});

lazyValue(); // 'foo'
lazyValue(); // 'foo' - cached

timesCalled; // 1
```

#### `makeObject`

Turn a dotted path into a json object.

```ts
makeObject('a.b.c', 1); // { a: { b: { c: 1 } } }
```

#### `mergeDefault`

Deep merges two objects. Properties from the second parameter are applied to the first.

```ts
const base = { a: 1, b: { c: 2 } };
const overwritten = { b: { d: 3 } };

mergeDefault(base, overwritten);
overwritten; // { a: 1, b: { c: 2, d: 3 } }
```

#### `mergeObjects`

Merges two objects.

```ts
const source = { a: 1, b: 2 };
const target = { c: 4 };

mergeObjects(source, target);
target; // { a: 1, b: 2, c: 4 }
```

#### `noop`

A no-operation function.

```ts
noop(); // undefined

// Example usage of ignoring a promise rejection
Promise.reject(new Error('noop')).catch(noop);
```

#### `objectToTuples`

Converts an object to a tuple with string paths.

```ts
const obj = { a: 1, b: { c: 2 } };
objectToTuples(obj); // [['a', 1], ['b.c', 2]]
```

#### `partition`

Partitions an array into a tuple of two arrays, where one array contains all elements that satisfies the predicate, and the other contains all elements that do not satisfy the predicate.

```ts
const arr = [1, 2, 3, 4, 5];
const [evens, odds] = partition(arr, n => n % 2 === 0);

evens; // [2, 4]
odds; // [1, 3, 5]
```

#### `pickRandom`

Picks a random element from an array.

```ts
const arr = [1, 2, 3, 4, 5];
pickRandom(arr); // 3
```

#### `range`

Get an array of numbers with the selected range, considering a specified step.

```ts
range(1, 4, 1); // [1, 2, 3, 4]
range(1, 4, 2); // [1, 3]
range(4, 1, -1); // [4, 3, 2, 1]
range(4, 1, -2); // [4, 2]
```

#### `regExpEsc`

Cleans a string from regex injection by escaping special characters.

```ts
regExpEsc('foo.bar?'); // 'foo\\.bar\\?'
```

#### `roundNumber`

Properly rounds up or down a number. Also supports strings using an exponent to indicate large or small numbers.

```ts
roundNumber(1.9134658034); // 1
roundNumber(1.9134658034, 2); // 1.91
roundNumber('10e-5'); // 0
```

#### `sleep` / `sleepSync`

Sleeps for the specified number of milliseconds.

```ts
await sleep(1000); // Sleeps for 1 second
sleepSync(1000); // Sleeps for 1 second
```

#### `splitText`

Split a string by its latest space character in a range from the character 0 to the selected one.

```ts
splitText('Hello All People!', 8); // 'Hello'
splitText('Hello All People!', 10); // 'Hello All'
```

#### `stopwatch`

A set of methods and properties used to accurately measure elapsed time.

```ts
// Create a new Stopwatch (which also starts it immediately)
const stopwatch = new Stopwatch();

// run other task here

console.log(stopwatch.stop().toString());
// 200ms
```

#### `throttle`

Creates a throttled function that only invokes a function at most once per every x milliseconds. The throttled function comes with a flush method to reset the last time the throttled function was invoked.

```ts
const throttled = throttle(() => console.log('throttled'), 1000);

throttled(); // 'throttled'
throttled(); // nothing
throttled.flush();
throttled(); // 'throttled'
```

#### `timerManager`

timer management utilities

```ts
setTimeout(() => {
	// Do something in half a second
}, Time.Second / 2 /* 500 */);

setTimeout(() => {
	// Do something in 6 hours
}, Time.Hour * 6 /* 21600000 */);

setTimeout(() => {
	// Do something in 1 day
}, Time.Day /* 86400000 */);

// Use the class for timeouts
const timeout = TimerManager.setTimeout(() => console.log('Hello, world!'), 1000);
TimerManager.clearTimeout(timeout);

// Use the class for intervals
const interval = TimerManager.setInterval(() => console.log('Hello, world!'), 1000);
TimerManager.clearInterval(interval);

// Destroy all running timeouts and intervals so that NodeJS can gracefully exit
TimerManager.destroy();
```

#### `timestamp`

formats a timestamp with typescript, human-readable code

```ts
// Saturday 9th March 2019, at 16:20:35:500
const date = new Date(2019, 2, 9, 16, 20, 35, 1);

// Format the date with tokens (use square brackets to escape)
const timestamp = new Timestamp('MMMM d YYYY[, at ]HH:mm:ss:SSS');
timestamp.display(date); // March 9th 2019, at 16:20:35:001

// Saturday 9th March 2019, at 16:20:35:500
const date = new Date(2019, 2, 9, 16, 20, 35, 1);

new Timestamp('Y').display(date); // 19
new Timestamp('YY').display(date); // 19
new Timestamp('YYY').display(date); // 2019
new Timestamp('YYYY').display(date); // 2019
new Timestamp('Q').display(date); // 1
new Timestamp('M').display(date); // 3
new Timestamp('MM').display(date); // 03
new Timestamp('MMM').display(date); // March
new Timestamp('MMMM').display(date); // March
new Timestamp('D').display(date); // 9
new Timestamp('DD').display(date); // 09
new Timestamp('DDD').display(date); // 68
new Timestamp('DDDD').display(date); // 68
new Timestamp('d').display(date); // 9th
new Timestamp('dd').display(date); // Sa
new Timestamp('ddd').display(date); // Sat
new Timestamp('dddd').display(date); // Saturday
new Timestamp('X').display(date); // 1552168835
new Timestamp('x').display(date); // 1552168835001
new Timestamp('H').display(date); // 16
new Timestamp('HH').display(date); // 16
new Timestamp('h').display(date); // 4
new Timestamp('hh').display(date); // 04
new Timestamp('a').display(date); // pm
new Timestamp('A').display(date); // PM
new Timestamp('m').display(date); // 20
new Timestamp('mm').display(date); // 20
new Timestamp('s').display(date); // 35
new Timestamp('ss').display(date); // 35
new Timestamp('S').display(date); // 0
new Timestamp('SS').display(date); // 00
new Timestamp('SSS').display(date); // 001
new Timestamp('t').display(date); // 4:20:35 PM
new Timestamp('T').display(date); // 4:20 PM
new Timestamp('L').display(date); // 03/09/2019
new Timestamp('LL').display(date); // March 09, 2019
new Timestamp('LLL').display(date); // March 09, 2019 4:20 PM
new Timestamp('LLLL').display(date); // Saturday, March 09, 2019 4:20 PM
new Timestamp('l').display(date); // 3/9/2019
new Timestamp('ll').display(date); // Mar 09, 2019
new Timestamp('lll').display(date); // Mar 09, 2019 4:20 PM
new Timestamp('llll').display(date); // Sat, Mar 09, 2019 4:20 PM
new Timestamp('Z').display(date); // -05:00
new Timestamp('ZZ').display(date); // -05:00
```

#### `toTitleCase`

Converts a string to Title Case.

```ts
toTitleCase('foo bar'); // 'Foo Bar'
toTitleCase('textchannel'); // 'TextChannel'
toTitleCase('onetwo three', { onetwo: 'OneTwo' }); // OneTwo Three
```

#### `cast`

Casts any value to `T`. Note that this function is not type-safe, and may cause runtime errors if used incorrectly.

```ts
const value = cast<string>(1); // value is now of type string
```

#### `objectEntries`

A strongly-typed alternative to `Object.entries`.

```ts
const obj = { a: 1, b: 2 } as const;

const native = Object.entries(obj); // [string, number][]
const strict = objectEntries(obj); // [['a', 1], ['b', 2]]
```

#### `objectKeys`

A strongly-typed alternative to `Object.keys`.

```ts
const obj = { a: 1, b: 2 } as const;

const native = Object.keys(obj); // string[]
const strict = objectKeys(obj); // ['a', 'b']
```

#### `objectValues`

A strongly-typed alternative to `Object.values`.

```ts
const obj = { a: 1, b: 2 } as const;

const native = Object.values(obj); // number[]
const strict = objectValues(obj); // [1, 2]
```

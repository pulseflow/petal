# named-tuple-spacing

Expect a space before a type declaration in a named tuple.

<!-- eslint-skip -->
```js
// 👎 bad
type T = [i:()=>void, j:number]
```

<!-- eslint-skip -->
```js
// 👍 good
type T = [i: ()=>void, j: number];
```

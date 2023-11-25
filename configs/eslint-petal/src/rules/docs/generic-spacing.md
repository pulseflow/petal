# generic-spacing

Enforces standard spacing around generic type parameters, which can get tricky and usually aren't automatically formatted in IDEs.

## Rule Details

<!-- eslint-skip -->
```js
// 👎 bad
type Foo<T=false,K=1|2> = T>
```

<!-- eslint-skip -->
```js
// 👍 good
type Foo<T = false, K = 1|2> = T;
```

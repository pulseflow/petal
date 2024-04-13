/* eslint-disable no-console */
// use typescript types, no long tsconfig needed!
interface HelloWorld { messages: string[] }

// use next-gen features like `satisfies` using petal's ESNext
const helloworld = {
	messages: [
		'hello world!',
		'this will be transpiled',
		'and formatted by petal!',
	],
} satisfies HelloWorld;

// check out the docs (https://petal.dyn.gay) for more information
console.log(helloworld.messages[0]);
console.log(`${helloworld.messages[1]} ${helloworld.messages[2]}`);

export type BoundMethods<Object extends _EmptyClass> = { [Key in keyof Object & string as Object[Key] extends (...args: any[]) => any ? Key : never]: Object[Key] };

export function boundMethods<Object extends _EmptyClass>(obj: Object): BoundMethods<Object> {
	const state: {
		currentObject: Object | null;
		methods: Record<string, unknown>;
	} = {
		currentObject: obj,
		methods: {},
	};

	while (state.currentObject && state.currentObject !== Object.prototype) {
		const keys = Reflect.ownKeys(obj) as Array<keyof Object>;
		keys.forEach((key) => {
			if (typeof key !== 'string')
				return;

			if (!Reflect.has(obj, key))
				return;

			if (typeof obj[key] === 'function' && key !== 'constructor')
				state.methods[key] = obj[key].bind(obj);
		});

		state.currentObject = Reflect.getPrototypeOf(state.currentObject) as Object;
	}

	return state.methods as BoundMethods<Object>;
}

class _EmptyClass {}

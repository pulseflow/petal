// primitive assertion system, will steal vitest's soon tm
export type Primitive = 'string' | 'number' | 'bigint' | 'boolean' | 'null';

function err(is: any, should: string) {
	throw new TypeError(`expected ${is} to be ${should}`);
}

export function assert<T>(i: T) {
	function is(type: Primitive) {
		switch (type) {
			case 'null':
				if (i !== null)
					err(i, type);
				break;
			case 'string':
			case 'number':
			case 'bigint':
			case 'boolean':
				// eslint-disable-next-line valid-typeof
				if (typeof i !== type)
					err(i, type);
				break;
			default:
				err(type, 'a valid primitive');
		}
	}

	const eq = (o: T) => {
		if (i !== o)
			err(i, `equal to ${o}`);
	};

	const neq = (o: T) => {
		if (i === o)
			err(i, `different from ${o}`);
	};

	return { is, eq, neq };
}

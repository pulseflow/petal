/**
 * Sample function that's used internally to confirm the tsconfig is valid
 * @private
 */
export function testBuild<Param>(param?: Param): [Param | undefined] | Param | number | Record<PropertyKey, Param> {
	if (typeof param === 'string')
		return param;
	if (typeof param === 'number')
		return (param as number) + 5;
	if (param instanceof Object)
		return { key: param };

	return [param];
}

describe('tsconfig', () => {
	it('should return param if instanceof string', () => {
		expect(testBuild('param')).toBe('param');
	});

	it('should return number + 5 is param instanceof number', () => {
		expect(testBuild(5)).toBe(10);
	});

	it('should return object if param instanceof object', () => {
		expect(testBuild({ param: 'value' })).toStrictEqual({ key: { param: 'value' } });
	});

	it('should fallback to array if param instance of none', () => {
		expect(testBuild()).toStrictEqual([undefined]);
	});
});

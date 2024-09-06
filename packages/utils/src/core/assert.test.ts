import * as assert from './assert';

it('assert', () => {
	expect(assert.isBoolean(true)).toBeTruthy();
	expect(assert.isBoolean(false)).toBeTruthy();
	expect(assert.isBoolean('true')).toBeFalsy();

	expect(assert.isDate(new Date())).toBeTruthy();
	expect(assert.isDate(Date.now())).toBeFalsy();

	expect(assert.isDef('test')).toBeTruthy();
	expect(assert.isDef(undefined)).toBeFalsy();

	expect(assert.isFunction(() => {})).toBeTruthy();
	expect(assert.isFunction('')).toBeFalsy();

	expect(assert.isNull(null)).toBeTruthy();
	expect(assert.isNull(undefined)).toBeFalsy();

	expect(assert.isNumber(100)).toBeTruthy();
	expect(assert.isNumber(Number(100))).toBeTruthy();
	expect(assert.isNumber('100')).toBeFalsy();

	expect(assert.isObject({})).toBeTruthy();
	expect(assert.isObject(new Object())).toBeTruthy();
});

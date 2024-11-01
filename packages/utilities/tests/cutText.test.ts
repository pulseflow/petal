import { cutText } from '../src';

describe('cutText', () => {
	it('given length much smaller than the first word then cuts up string', () => {
		expect(cutText('Lorem Ipsum', 2)).toEqual('L…');
	});

	it('given length 1 char smaller than the first word length then cuts up string', () => {
		expect(cutText('Lorem Ipsum', 5)).toEqual('Lore…');
	});

	it('given length 1 char longer than the first word then first word with …', () => {
		expect(cutText('Lorem Ipsum', 9)).toEqual('Lorem…');
	});

	it('given length longer than total then returns unmodified', () => {
		expect(cutText('Lorem Ipsum', 30)).toEqual('Lorem Ipsum');
	});

	it('given unicode characters that fit then returns the string as-is', () => {
		expect(cutText('🔥🔥', 2)).toEqual('🔥🔥');
	});

	it('given unicode characters then returns a correctly-formatted string', () => {
		expect(cutText('🔥🔥🔥', 2)).toEqual('🔥…');
	});

	it('given line breaks then returns a correctly-formatted string', () => {
		expect(cutText('Hi Barbie!\nHi Ken!', 13)).toEqual('Hi Barbie!…');
	});

	it('given a family then it only lets the parents in', () => {
		expect(cutText('👨‍👨‍👧‍👧', 4)).toEqual('👨‍👨…');
	});
	it('given a family then it only shows the emoji if it fits', () => {
		expect(cutText('Hello 👨‍👨‍👧‍👧!', 10)).toEqual('Hello…');
	});
});

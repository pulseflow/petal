import type { Person } from './eventIteratorFixture/Person';
import { setTimeout as sleep } from 'node:timers/promises';
import { EventIterator } from '../src/lib/eventIterator';
import { people, PeopleEmitter } from './eventIteratorFixture/MockEmitter';

describe('eventIterator', () => {
	it('peopleIterator is an instanceof EventIterator', () => {
		const emitter = new PeopleEmitter();
		const iter = emitter.createPeopleIterator();
		expect(iter instanceof EventIterator).toBe(true);

		iter.end();
		emitter.destroy();
	});

	it('eventIterator#ended', () => {
		const emitter = new PeopleEmitter();
		const iter = emitter.createPeopleIterator();
		expect(iter.ended).toBe(false);
		iter.end();
		expect(iter.ended).toBe(true);
		iter.end();
		expect(iter.ended).toBe(true);

		emitter.destroy();
	});

	it('eventIterator#next', async () => {
		const emitter = new PeopleEmitter();

		const iter = emitter.createPeopleIterator({ limit: people.length });
		const firstValue = await iter.next();
		expect(firstValue).toStrictEqual({ done: false, value: [people[0]] });

		const secondValue = await iter.next();
		expect(secondValue).toStrictEqual({ done: false, value: [people[1]] });

		iter.end();
		const thirdValue = await iter.next();
		expect(thirdValue).toStrictEqual({ done: true, value: undefined });

		emitter.destroy();
	});

	it('eventIterator ends when it hits it\'s limit', async () => {
		const emitter = new PeopleEmitter();
		const iter = emitter.createPeopleIterator({ limit: 2 });

		let count = 0;
		for await (const value of iter)
			expect(value).toStrictEqual([people[count++]]);

		expect(count).toBe(2);

		emitter.destroy();
	});

	it('eventIterator properly filters values', async () => {
		const emitter = new PeopleEmitter();

		const filteredPeople = people.filter((person: Person): boolean => person.name.length === 3);
		const iter = emitter.createPeopleIterator({
			filter: ([person]: [Person]): boolean => person.name.length === 3,
			limit: filteredPeople.length,
		});

		let count = 0;
		for await (const value of iter)
			expect(value).toStrictEqual([filteredPeople[count++]]);

		expect(count).toBe(filteredPeople.length);

		emitter.destroy();
	});

	it('eventIterator properly times out', async () => {
		const emitter = new PeopleEmitter();

		const iter = emitter.createPeopleIterator({ idle: 500 });

		// eslint-disable-next-line no-empty-pattern -- test
		for await (const {} of iter)
			expect(false).toBe(true);

		expect(iter.ended).toBe(true);

		emitter.destroy();
	});

	it('eventIterator timer properly idles out with iterations', async () => {
		const emitter = new PeopleEmitter();

		const iter = emitter.createPeopleIterator({ idle: 1200 });
		let count = 0;

		for await (const value of iter)
			expect(value).toStrictEqual([people[count++]]);

		expect(count).toBe(3);

		emitter.destroy();
	});

	it('eventIterator properly increases listeners', () => {
		const emitter = new PeopleEmitter();
		emitter.setMaxListeners(1);

		const iter = emitter.createPeopleIterator();
		expect(emitter.getMaxListeners()).toBe(2);

		iter.end();
		expect(emitter.getMaxListeners()).toBe(1);

		emitter.destroy();
	});

	it('eventIterator does not increase listener count when count is 0', () => {
		const emitter = new PeopleEmitter();
		emitter.setMaxListeners(0);

		const iter = emitter.createPeopleIterator();
		expect(emitter.getMaxListeners()).toBe(0);

		iter.end();
		expect(emitter.getMaxListeners()).toBe(0);

		emitter.destroy();
	});

	it('eventIterator decreases count when loop is broken', async () => {
		const emitter = new PeopleEmitter();
		emitter.setMaxListeners(1);

		const iter = emitter.createPeopleIterator();
		expect(emitter.getMaxListeners()).toBe(2);

		// eslint-disable-next-line no-unreachable-loop, no-empty-pattern -- test
		for await (const {} of iter)
			break;

		expect(emitter.getMaxListeners()).toBe(1);

		emitter.destroy();
	});

	it('eventIterator decreases count when loop is thrown from', async () => {
		const emitter = new PeopleEmitter();
		emitter.setMaxListeners(1);

		const iter = emitter.createPeopleIterator();
		expect(emitter.getMaxListeners()).toBe(2);

		try {
			// eslint-disable-next-line no-unreachable-loop, no-empty-pattern -- test
			for await (const {} of iter)
				throw new Error('girsl kissing');
		}
		catch {
			// noop
		}

		expect(emitter.getMaxListeners()).toBe(1);

		emitter.destroy();
	});

	it('eventIterator decreases count when some unknown internal throw happens', async () => {
		const emitter = new PeopleEmitter();
		emitter.setMaxListeners(1);

		const iter = emitter.createPeopleIterator();
		expect(emitter.getMaxListeners()).toBe(2);

		await iter.throw();

		expect(emitter.getMaxListeners()).toBe(1);

		emitter.destroy();
	});

	it('eventIterator does not have a next value after throwing', async () => {
		const emitter = new PeopleEmitter();

		const iter = emitter.createPeopleIterator();
		expect(iter.ended).toBe(false);

		await sleep(3000);
		await iter.throw();
		expect(iter.ended).toBe(true);

		const next = await iter.next();
		expect(next.value).toBe(undefined);
		expect(next.done).toBe(true);

		emitter.destroy();
	});

	it('eventIterator does not have a next value after breaking', async () => {
		const emitter = new PeopleEmitter();

		const iter = emitter.createPeopleIterator();
		expect(iter.ended).toBe(false);

		await sleep(3000);
		// eslint-disable-next-line no-unreachable-loop, no-empty-pattern -- test
		for await (const {} of iter) break;
		expect(iter.ended).toBe(true);

		const next = await iter.next();
		expect(next.value).toBe(undefined);
		expect(next.done).toBe(true);

		emitter.destroy();
	});
});

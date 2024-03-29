import ZenObservable from 'zen-observable';
import { describe, expect, it } from 'vitest';
import type { Observable, Observer, Subscription } from '../../src/index.js';

describe('observable', () => {
	it('works in conjunction with zen-observables', () => {
		// Use ZenObservable as the concrete implementation, but use our types in
		// all other possible places in the code
		const observable: Observable<string> = new ZenObservable<string>(
			(subscriber: Observer<string>) => {
				subscriber.next!('a');
				subscriber.error!(new Error('e'));
				subscriber.complete!();
			},
		);

		const subscription: Subscription = observable.subscribe(
			(_value) => {},
			(_error) => {},
			() => {},
		);

		subscription.unsubscribe();

		expect(true).toBe(true);
	});
});

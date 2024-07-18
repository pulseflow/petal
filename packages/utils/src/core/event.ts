import type { ArgsFn } from '../types';

type Listener<Event = any, Return = any> = (event: Event) => Return;

export default function handler<T extends Record<string, any> = Record<string, never>>(): {
	subscribe: {
		<K extends keyof T & string>(event: K, listener: Listener<T[K]>): void;
		<K extends string>(event: K extends keyof T & string ? never : K, listener: Listener): void;
		(event: string, listener: Listener): void;
	};
	emit: {
		<K extends keyof T & string>(event: K, data: T[K]): Promise<any[]>;
		<K extends string>(event: K extends keyof T & string ? never : K, data: any): Promise<any[]>;
		(event: string, data: any[]): Promise<any[]>;
	};
} {
	const listeners = new Map<string, ArgsFn[]>();
	type EventName = keyof T & string;

	function subscribe<K extends keyof T & string>(event: K, listener: Listener<T[K]>): void;
	function subscribe<K extends string>(event: K extends EventName ? never : K, listener: Listener): void;
	function subscribe(event: string, listener: Listener): void {
		if (!listeners.has(event))
			listeners.set(event, []);

		listeners.get(event)!.push(listener);
	}

	function emit<K extends keyof T & string>(event: K, data: T[K]): Promise<any[]>;
	function emit<K extends string>(event: K extends EventName ? never : K, data: any): Promise<any[]>;
	function emit(event: string, data: any): Promise<any[]> {
		if (!listeners.has(event))
			return Promise.resolve([]);

		return Promise.all(listeners.get(event)!.map(f => Promise.resolve(f(data))));
	}

	return { subscribe, emit };
}

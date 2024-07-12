export default function handler<T extends Record<string, any> = Record<string, never>>() {
	const listeners = new Map<string, ((...any: any[]) => any)[]>();
	type EventName = keyof T & string;

	function subscribe<K extends keyof T & string>(event: K, listener: (event: T[K]) => any): void;
	function subscribe<K extends string>(event: K extends EventName ? never : K, listener: (event: any) => any): void;
	function subscribe(event: string, listener: (event: any) => any): void {
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

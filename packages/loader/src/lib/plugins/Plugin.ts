import type { Awaitable } from '@flowr/types';

export const preHook: unique symbol = Symbol('PetalLoaderPreHook');
export const postHook: unique symbol = Symbol('PetalLoaderPostHook');

export enum PluginHook {
	PreHook = 'preHook',
	PostHook = 'postHook',
}

export type AsyncPluginHooks = PluginHook.PreHook | PluginHook.PostHook;
export interface PetalAsyncPluginHook<Client> { (this: Client): Awaitable<unknown> }

export type SyncPluginHooks = Exclude<PluginHook, AsyncPluginHooks>;
export interface PetalSyncPluginHook<Client> { (this: Client): unknown }

export type PetalPluginHook<Client> = PetalSyncPluginHook<Client> | PetalAsyncPluginHook<Client>;

export interface PetalPluginHookEntry<Client, T = PetalPluginHook<Client>> {
	hook: T;
	type: PluginHook;
	name?: string;
}

export abstract class Plugin<Client> {
	public [preHook]?: (this: Client) => Awaitable<void>;
	public [postHook]?: (this: Client) => Awaitable<void>;
}

export class PluginManager<Client> {
	public readonly registry: Set<PetalPluginHookEntry<Client>> = new Set();

	public registerHook(hook: PetalSyncPluginHook<Client>, type: SyncPluginHooks, name?: string): this;
	public registerHook(hook: PetalAsyncPluginHook<Client>, type: AsyncPluginHooks, name?: string): this;
	public registerHook(hook: PetalPluginHook<Client>, type: PluginHook, name?: string): this {
		if (typeof hook !== 'function')
			throw new TypeError(`The provided hook ${name ? `(${name})` : ''} is not a function!`);

		this.registry.add({ hook, name, type });
		return this;
	}

	public registerPreHook(hook: PetalAsyncPluginHook<Client>, name?: string): this {
		return this.registerHook(hook, PluginHook.PreHook, name);
	}

	public registerPostHook(hook: PetalAsyncPluginHook<Client>, name?: string): this {
		return this.registerHook(hook, PluginHook.PostHook, name);
	}

	public use(plugin: typeof Plugin): this {
		const possibleSymbolHooks: Array<[symbol, PluginHook]> = [
			[preHook, PluginHook.PreHook],
			[postHook, PluginHook.PostHook],
		];

		for (const [hookSymbol, hookType] of possibleSymbolHooks) {
			const hook = Reflect.get(plugin, hookSymbol) as PetalPluginHook<Client>;

			if (typeof hook !== 'function')
				continue;

			this.registerHook(hook, hookType);
		}

		return this;
	}

	public values(hook: SyncPluginHooks): Generator<PetalPluginHookEntry<Client, PetalSyncPluginHook<Client>>, void, unknown>;
	public values(hook: AsyncPluginHooks): Generator<PetalPluginHookEntry<Client, PetalAsyncPluginHook<Client>>, void, unknown>;
	public *values(hook: PluginHook): Generator<PetalPluginHookEntry<Client>, void, unknown> {
		for (const plugin of this.registry) {
			if (hook && plugin.type !== hook)
				continue;

			yield plugin;
		}
	}
}

import type { AbstractConstructor, Constructor } from '@flowr/types';
import type { Piece } from './Piece';
import type { StoreRegistryEntries, StoreRegistryKey } from './StoreRegistry';
import { classExtends, isClass } from '@flowr/utilities';
import { Collection } from '@flowr/utilities/collection';
import { join } from 'pathe';
import { LoaderError, LoaderErrorType } from '../errors/LoaderError';
import { type HydratedModuleData, hydrateModuleData, type ILoaderResultEntry, type ILoaderStrategy } from '../strategies/ILoaderStrategy';
import { LoaderStrategy } from '../strategies/LoaderStrategy';
import { ManuallyRegisteredPiecesSymbol, type Path, resolvePath, VirtualPath } from '../utils.ts';
import { container, type Container } from './Container';

/**
 * The options for the store, this features both hooks (changes the behaviour) and handlers (similar to event listeners).
 */
export interface StoreOptions<T extends Piece, StoreName extends StoreRegistryKey = StoreRegistryKey> {
	/**
	 * The name for this store.
	 */
	readonly name: StoreName;

	/**
	 * The paths to load pieces from, should be absolute.
	 * @default []
	 */
	readonly paths?: readonly string[];

	/**
	 * The strategy to be used for the loader.
	 * @default Store.defaultStrategy
	 */
	readonly strategy?: ILoaderStrategy<T>;
}

/**
 * An interface representing a logger function.
 */
export interface StoreLogger {
	/**
	 * @param value The string to print. All strings will be formatted with the format `[STORE => ${name}] [${type}] ${content}`,
	 * where the content may have identifiers (values or names of methods) surrounded by `'`. For example:
	 *
	 * - `[STORE => commands] [LOAD] Skipped piece '/home/user/bot/src/commands/foo.js' as 'LoaderStrategy#filter' returned 'null'.`
	 * - `[STORE => commands] [INSERT] Unloaded new piece 'foo' due to 'enabled' being 'false'.`
	 * - `[STORE => commands] [UNLOAD] Unloaded piece 'foo'.`
	 */
	(value: string): void;
}

const defaultStrategy = new LoaderStrategy();

/**
 * The store class which contains {@link Piece}s.
 */
export class Store<T extends Piece, StoreName extends StoreRegistryKey = StoreRegistryKey> extends Collection<string, T> {
	public readonly Constructor: AbstractConstructor<T>;
	public readonly name: StoreName;
	public readonly paths: Set<string>;
	public readonly strategy: ILoaderStrategy<T>;

	/**
	 * A reference to the {@link Container} object for ease of use.
	 *
	 * @see container
	 */
	public static readonly container: Container = container;

	/**
	 * The queue of manually registered pieces to load.
	 */
	private readonly [ManuallyRegisteredPiecesSymbol]: Map<string, StoreManuallyRegisteredPiece<StoreName>> = new Map();

	/**
	 * Whether or not the store has called {@link loadAll `loadAll`} at least once.
	 */
	#initialized = false;

	/**
	 * The walk function for the store.
	 */
	#walk: LoaderStrategy<T>['walk'];

	/**
	 * @param constructor The piece constructor this store loads.
	 * @param options The options for the store.
	 */
	public constructor(constructor: AbstractConstructor<T>, options: StoreOptions<T, StoreName>) {
		super();
		this.Constructor = constructor;
		this.name = options.name as StoreRegistryKey;
		this.paths = new Set(options.paths ?? []);
		this.strategy = options.strategy ?? Store.defaultStrategy;
		this.#walk = typeof this.strategy.walk === 'function'
			? this.strategy.walk.bind(this.strategy)
			: defaultStrategy.walk.bind(defaultStrategy);
	}

	/**
	 * Registers a directory into the store.
	 * @param path The path to be added.
	 * @example
	 * ```typescript
	 * store
	 * 	.registerPath(resolve('commands'))
	 * 	.registerPath(resolve('third-party', 'commands'));
	 * ```
	 */
	public registerPath(path: Path): this {
		const root = resolvePath(path);

		this.paths.add(root);
		Store.logger?.(`[STORE => ${this.name}] [REGISTER] Registered path '${root}'.`);
		return this;
	}

	/**
	 * Adds a piece into the store's list of manually registered pieces. If {@linkcode Store.loadAll()} was called, the
	 * piece will be loaded immediately, otherwise it will be queued until {@linkcode Store.loadAll()} is called.
	 *
	 * All manually registered pieces will be kept even after they are loaded to ensure they can be loaded again if
	 * {@linkcode Store.loadAll()} is called again.
	 *
	 * @remarks
	 *
	 * - Pieces loaded this way will have their {@linkcode LoaderPieceContexts.root root} and
	 * 	{@linkcode LoaderPieceContext.path path} set to {@linkcode VirtualPath}, and as such, cannot be reloaded.
	 * - This method is useful in environments where file system access is limited or unavailable, such as when using
	 * 	{@linkplain https://en.wikipedia.org/wiki/Serverless_computing Serverless Computing}.
	 * - This method will always throw a {@link TypeError} if `entry.piece` is not a class.
	 * - This method will always throw a {@linkcode LoaderError} if the piece does not extend the
	 * 	{@linkcode Store#Constructor store's piece constructor}.
	 * - This operation is atomic, if any of the above errors are thrown, the piece will not be loaded.
	 *
	 * @seealso {@linkcode StoreRegistry.loadPiece()}
	 * @param entry The entry to load.
	 * @example
	 * ```typescript
	 * import { container } from '@flowr/loader';
	 *
	 * class PingCommand extends Command {
	 * 	// ...
	 * }
	 *
	 * container.stores.get('commands').loadPiece({
	 * 	name: 'ping',
	 * 	piece: PingCommand
	 * });
	 * ```
	 */
	public async loadPiece(entry: StoreManuallyRegisteredPiece<StoreName>): Promise<void> {
		if (!isClass(entry.piece))
			throw new TypeError(`The piece ${entry.name} is not a Class. ${String(entry.piece)}`);

		// If the piece does not extend the store's Piece class, throw an error:
		if (!classExtends(entry.piece, this.Constructor as Constructor<T>))
			throw new LoaderError(LoaderErrorType.IncorrectType, `The piece ${entry.name} does not extend ${this.name}`);

		this[ManuallyRegisteredPiecesSymbol].set(entry.name, entry);
		if (this.#initialized) {
			const piece = this.construct(entry.piece, {
				extension: VirtualPath,
				name: entry.name,
				path: VirtualPath,
				root: VirtualPath,
			});
			await this.insert(piece);
		}
	}

	/**
	 * Loads one or more pieces from a path.
	 * @param root The root directory the file is from.
	 * @param path The path of the file to load, relative to the `root`.
	 * @return All the loaded pieces.
	 */
	public async load(root: string, path: string): Promise<T[]> {
		if (root === VirtualPath)
			throw new LoaderError(LoaderErrorType.VirtualPiece, `Cannot load a virtual file.`);

		const full = join(root, path);
		const data = this.strategy.filter(full);
		if (data === null) {
			Store.logger?.(`[STORE => ${this.name}] [LOAD] Skipped piece '${full}' as 'LoaderStrategy#filter' returned 'null'.`);
			return [];
		}

		const promises: Array<Promise<T>> = [];
		const finishedData = hydrateModuleData(root, data);
		for await (const Ctor of this.strategy.load(this, finishedData))
			promises.push(this.insert(this.construct(Ctor, finishedData)));

		return Promise.all(promises);
	}

	/**
	 * Unloads a piece given its instance or its name.
	 * @param name The name of the file to load.
	 * @return Returns the piece that was unloaded.
	 */
	public async unload(name: string | T): Promise<T> {
		const piece = this.resolve(name);

		// Unload piece:
		this.strategy.onUnload(this, piece);
		await piece.onUnload();
		Store.logger?.(`[STORE => ${this.name}] [UNLOAD] Unloaded piece '${piece.name}'.`);

		// Remove from cache and return it:
		this.delete(piece.name);
		Store.logger?.(`[STORE => ${this.name}] [UNLOAD] Removed piece '${piece.name}'.`);
		return piece;
	}

	/**
	 * Unloads all pieces from the store.
	 */
	public async unloadAll(): Promise<T[]> {
		const promises: Array<Promise<T>> = [];
		for (const piece of this.values())
			promises.push(this.unload(piece));

		const results = await Promise.all(promises);

		this.strategy.onUnloadAll(this);
		Store.logger?.(`[STORE => ${this.name}] [UNLOAD-ALL] Removed all pieces.`);
		return results;
	}

	/**
	 * Loads all pieces from all directories specified by {@link paths}.
	 */
	public async loadAll(): Promise<void> {
		this.#initialized = true;

		const pieces: T[] = [];
		for (const entry of this[ManuallyRegisteredPiecesSymbol].values()) {
			const piece = this.construct(entry.piece as unknown as Constructor<T>, {
				extension: VirtualPath,
				name: entry.name,
				path: VirtualPath,
				root: VirtualPath,
			});
			pieces.push(piece);
		}

		for (const path of this.paths)
			for await (const piece of this.loadPath(path))
				pieces.push(piece);

		Store.logger?.(`[STORE => ${this.name}] [LOAD-ALL] Found '${pieces.length}' pieces.`);

		// Clear the store before inserting the new pieces:
		await this.unloadAll();
		Store.logger?.(`[STORE => ${this.name}] [LOAD-ALL] Cleared all pieces.`);

		// Load each piece:
		for (const piece of pieces)
			await this.insert(piece);

		// Call onLoadAll:
		this.strategy.onLoadAll(this);
		Store.logger?.(`[STORE => ${this.name}] [LOAD-ALL] Successfully loaded '${this.size}' pieces.`);
	}

	/**
	 * Resolves a piece by its name or its instance.
	 * @param name The name of the piece or the instance itself.
	 * @return The resolved piece.
	 */
	public resolve(name: string | T): T {
		if (typeof name === 'string') {
			const result = this.get(name);
			if (typeof result === 'undefined')
				throw new LoaderError(LoaderErrorType.UnloadedPiece, `The piece '${name}' does not exist.`);
			return result;
		}

		if (name instanceof this.Constructor)
			return name;
		throw new LoaderError(LoaderErrorType.IncorrectType, `The piece '${name.name}' is not an instance of '${this.Constructor.name}'.`);
	}

	/**
	 * Inserts a piece into the store.
	 * @param piece The piece to be inserted into the store.
	 * @return The inserted piece.
	 */
	public async insert(piece: T): Promise<T> {
		if (!piece.enabled)
			return piece;

		// Load piece:
		this.strategy.onLoad(this, piece);
		await piece.onLoad();
		Store.logger?.(`[STORE => ${this.name}] [INSERT] Loaded new piece '${piece.name}'.`);

		// If the onLoad disabled the piece, call unload and return it:
		// eslint-disable-next-line ts/no-unnecessary-condition -- side effects from onLoad
		if (!piece.enabled) {
			this.strategy.onUnload(this, piece);
			await piece.onUnload();
			Store.logger?.(`[STORE => ${this.name}] [INSERT] Unloaded new piece '${piece.name}' due to 'enabled' being 'false'.`);

			return piece;
		}

		// Unload existing piece, if any:
		const previous = super.get(piece.name);
		if (previous) {
			await this.unload(previous);
			Store.logger?.(`[STORE => ${this.name}] [INSERT] Unloaded existing piece '${piece.name}' due to conflicting 'name'.`);
		}

		// Set the new piece and return it:
		this.set(piece.name, piece);
		Store.logger?.(`[STORE => ${this.name}] [INSERT] Inserted new piece '${piece.name}'.`);
		return piece;
	}

	/**
	 * Constructs a {@link Piece} instance.
	 * @param Ctor The {@link Piece}'s constructor used to build the instance.
	 * @param data The module's information
	 * @return An instance of the constructed piece.
	 */
	public construct(Ctor: ILoaderResultEntry<T>, data: HydratedModuleData): T {
		return new Ctor({ name: data.name, path: data.path, root: data.root, store: this }, { enabled: true, name: data.name });
	}

	/**
	 * Loads a directory into the store.
	 * @param root The directory to load the pieces from.
	 * @return An async iterator that yields the pieces to be loaded into the store.
	 */
	private async *loadPath(root: string): AsyncIterableIterator<T> {
		Store.logger?.(`[STORE => ${this.name}] [WALK] Loading all pieces from '${root}'.`);
		for await (const child of this.#walk(this, root, Store.logger)) {
			const data = this.strategy.filter(child);
			if (data === null) {
				Store.logger?.(`[STORE => ${this.name}] [LOAD] Skipped piece '${child}' as 'LoaderStrategy#filter' returned 'null'.`);
				continue;
			}
			try {
				const finishedData = hydrateModuleData(root, data);
				for await (const Ctor of this.strategy.load(this, finishedData))
					yield this.construct(Ctor, finishedData);
			}
			catch (error) {
				this.strategy.onError(error as Error, data.path);
			}
		}
	}

	/**
	 * The default strategy, defaults to {@link LoaderStrategy}, which is constructed on demand when a store is constructed,
	 * when none was set beforehand.
	 */
	public static defaultStrategy: ILoaderStrategy<any> = defaultStrategy;

	/**
	 * The default logger, defaults to `null`.
	 */
	public static logger: StoreLogger | null = null;
}

/**
 * An entry for a manually registered piece using {@linkcode Store.loadPiece()}.
 */
export interface StoreManuallyRegisteredPiece<StoreName extends StoreRegistryKey> {
	name: string;
	piece: StoreRegistryEntries[StoreName] extends Store<infer Piece> ? Constructor<Piece> : never;
}

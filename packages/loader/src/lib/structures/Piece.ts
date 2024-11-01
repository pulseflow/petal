import type { Awaitable } from '@flowr/types';
import type { StoreOf, StoreRegistryKey } from './StoreRegistry';
import { container, type Container } from './Container';
import { PieceLocation, type PieceLocationJSON } from './PieceLocation';

/**
 * The context for the piece, contains extra information from the store,
 * the piece's path, and the store that loaded it.
 */
export interface LoaderPieceContext<StoreName extends StoreRegistryKey = StoreRegistryKey> {
	/**
	 * The root directory the piece was loaded from.
	 */
	readonly root: string;

	/**
	 * The path the module was loaded from, relative to {@link root}.
	 */
	readonly path: string;

	/**
	 * The module's name extracted from the path.
	 */
	readonly name: string;

	/**
	 * The store that loaded the piece.
	 */
	readonly store: StoreOf<StoreName>;
}

/**
 * The options for the {@link Piece}.
 */
export interface PieceOptions {
	/**
	 * The name for the piece.
	 * @default ''
	 */
	readonly name?: string;

	/**
	 * Whether or not the piece should be enabled. If set to false, the piece will be unloaded.
	 * @default true
	 */
	readonly enabled?: boolean;
}

/**
 * The piece to be stored in {@link Store} instances.
 */
export class Piece<Options extends PieceOptions = PieceOptions, StoreName extends StoreRegistryKey = StoreRegistryKey> {
	/**
	 * The store that contains the piece.
	 */
	public readonly store: StoreOf<StoreName>;

	/**
	 * The location metadata for the piece's file.
	 */
	public readonly location: PieceLocation;

	/**
	 * The name of the piece.
	 */
	public readonly name: string;

	/**
	 * Whether or not the piece is enabled.
	 */
	public enabled: boolean;

	/**
	 * The raw options passed to this {@link Piece}
	 */
	public readonly options: Options;

	/**
	 * A reference to the {@link Container} object for ease of use.
	 * @see container
	 */
	public static readonly container: Container = container;

	public constructor(context: LoaderPieceContext<StoreName>, options: PieceOptions = {}) {
		this.store = context.store;
		this.location = new PieceLocation(context.path, context.root);
		this.name = options.name ?? context.name;
		this.enabled = options.enabled ?? true;
		this.options = options as Options;
	}

	/**
	 * Per-piece listener that is called when the piece is loaded into the store.
	 * Useful to set-up asynchronous initialization tasks.
	 */
	// eslint-disable-next-line ts/class-methods-use-this -- callback/qol
	public onLoad(): Awaitable<unknown> {
		return undefined;
	}

	/**
	 * Per-piece listener that is called when the piece is unloaded from the store.
	 * Useful to set-up clean-up tasks.
	 */
	// eslint-disable-next-line ts/class-methods-use-this -- callback/qol
	public onUnload(): Awaitable<unknown> {
		return undefined;
	}

	/**
	 * Unloads and disables the piece.
	 */
	public async unload(): Promise<void> {
		await this.store.unload(this.name);
		this.enabled = false;
	}

	/**
	 * Reloads the piece by loading the same path in the store.
	 */
	public async reload(): Promise<void> {
		await this.store.load(this.location.root, this.location.relative);
	}

	/**
	 * Defines the `JSON.stringify` behavior of this piece.
	 */
	public toJSON(): PieceJSON {
		return {
			enabled: this.enabled,
			location: this.location.toJSON(),
			name: this.name,
			options: this.options,
		};
	}
}

/**
 * The return type of {@link Piece.toJSON}.
 */
export interface PieceJSON {
	location: PieceLocationJSON;
	name: string;
	enabled: boolean;
	options: PieceOptions;
}

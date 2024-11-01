import type { AliasPiece } from './AliasPiece';
import type { StoreRegistryKey } from './StoreRegistry';
import { Collection } from '@flowr/utilities/collection';
import { Store } from './Store';

/**
 * The store class which contains {@link AliasPiece}s.
 */
export class AliasStore<T extends AliasPiece, StoreName extends StoreRegistryKey = StoreRegistryKey> extends Store<T, StoreName> {
	/**
	 * The aliases referencing to pieces.
	 */
	public readonly aliases: Collection<string, T> = new Collection();

	/**
	 * Looks up the name by the store, falling back to an alias lookup.
	 * @param key The key to look for.
	 */
	public override get(key: string): T | undefined {
		return super.get(key) ?? this.aliases.get(key);
	}

	/**
	 * Checks whether a key is in the store, or is an alias
	 * @param key The key to check
	 */
	public override has(key: string): boolean {
		return super.has(key) || this.aliases.has(key);
	}

	/**
	 * Unloads a piece given its instance or its name, and removes all the aliases.
	 * @param name The name of the file to load.
	 * @return Returns the piece that was unloaded.
	 */
	public override async unload(name: string | T): Promise<T> {
		const piece = this.resolve(name);

		for (const alias of piece.aliases) {
			const aliasPiece = this.aliases.get(alias);
			if (aliasPiece === piece)
				this.aliases.delete(alias);
		}

		return super.unload(piece);
	}

	/**
	 * Inserts a piece into the store, and adds all the aliases.
	 * @param piece The piece to be inserted into the store.
	 * @return The inserted piece.
	 */
	public override async insert(piece: T): Promise<T> {
		for (const key of piece.aliases)
			this.aliases.set(key, piece);

		return super.insert(piece);
	}
}

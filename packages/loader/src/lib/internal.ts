import type { URL } from 'node:url';

export async function mjsImport(path: string | URL): Promise<any> {
	return import(path as any);
}

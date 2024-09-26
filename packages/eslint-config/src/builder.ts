import type { TypedFlatConfigItem } from './types';

interface Builder {
	(type: string, sub: TypedFlatConfigItem): Builder;
	build: () => TypedFlatConfigItem[];
}

export function builder(name: string, configs: TypedFlatConfigItem[] = []): Builder {
	const builderInstance = (type: string, sub: TypedFlatConfigItem): Builder => {
		configs.push({
			name: `${name}/${type}`,
			...sub,
		});

		return builderInstance;
	};

	builderInstance.build = () => configs;

	return builderInstance;
}

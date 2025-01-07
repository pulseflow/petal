import type { IType } from './base/IType.ts';

export function ConstantType<const ValueType>(constantValue: ValueType): IType<ValueType, 0, never> {
	return {
		serialize(_buffer, _value) {},
		deserialize(_buffer, _pointer) {
			return constantValue;
		},
		BIT_SIZE: 0,
	};
}

import { cast } from '@flowr/utilities/cast';

/**
 * Decorator that sets the enumerable property of a class field to the desired value.
 * @param value Whether the property should be enumerable or not
 *
 * @remarks
 * Please note that with legacy decorators there is a high chance that this will not work due to how legacy decorators
 * are implemented. It is recommended to use the modern ECMAScript decorators.
 */
export function Enumerable<ClzArgs extends object>(value: boolean): EnumerableDecorator<ClzArgs> {
	return (target: ClzArgs | undefined, contextOrPropertyKey: (string | symbol) | ClassFieldDecoratorContext<ClzArgs, any>) => {
		if (target === undefined) {
			const typedContext = cast<ClassFieldDecoratorContext<ClzArgs, any>>(contextOrPropertyKey);
			typedContext.addInitializer(function decorate(this: ClzArgs) {
				Reflect.defineProperty(this, typedContext.name, {
					configurable: true,
					enumerable: value,
					value: typedContext.access.get(this),
					writable: true,
				});
			});
		}
		else {
			const typedPropertyKey = cast<string | symbol>(contextOrPropertyKey);
			Reflect.defineProperty(target, typedPropertyKey, {
				enumerable: value,
				get: () => Reflect.get(target, typedPropertyKey),
				set(this: object, fieldValue: unknown) {
					Reflect.defineProperty(this, typedPropertyKey, {
						configurable: true,
						enumerable: value,
						value: fieldValue,
						writable: true,
					});
				},
			});
		}
	};
}

/**
 * Decorator that sets the enumerable property of a class method to the desired value.
 *
 * @param value - Whether the method should be enumerable or not. By default class methods are not enumerable.
 *
 * @remarks
 * Please note that with legacy decorators there is a high chance that this will not work due to how legacy decorators
 * are implemented. It is recommended to use the modern ECMAScript decorators.
 */
export function EnumerableMethod(value: boolean): EnumerableMethodDecorator {
	return <Args = unknown[], ReturnType = unknown>(
		target: ((...args: Args[]) => ReturnType) | unknown,
		contextOrPropertyKey: (string | symbol) | ClassMethodDecoratorContext<object, any>,
		descriptor?: TypedPropertyDescriptor<(...args: Args[]) => ReturnType>,
	): void => {
		if (descriptor === undefined) {
			const typedContext = cast<ClassMethodDecoratorContext<object, any>>(contextOrPropertyKey);
			typedContext.addInitializer(function decorate(this: object) {
				Reflect.defineProperty(this, typedContext.name, {
					configurable: true,
					enumerable: value,
					value: target,
					writable: true,
				});
			});
		}
		else {
			Reflect.defineProperty(target as object, contextOrPropertyKey as string | symbol, {
				configurable: true,
				enumerable: value,
				value: descriptor.value,
				writable: true,
			});
		}
	};
}

/**
 * The return type for {@link Enumerable}
 *
 * @param ClzArgs - The class constructor arguments
 */
export type EnumerableDecorator<ClzArgs extends object> = (target: undefined, contextOrPropertyKey: ClassFieldDecoratorContext<ClzArgs, any>) => void;

/**
 * The return type for {@link EnumerableMethod}
 */
export type EnumerableMethodDecorator = (<Args extends any[]>(target: unknown, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<(...args: Args[]) => unknown>) => void);

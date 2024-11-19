import { roundNumber } from './roundNumber';

const uniqueTransformError = `
Looks like your from unit had a "unique transform".
Units with a unique transform can only be used as the "toUnit"
as they return the final conversion result.`
	.replace(/(?:\n\s*)+/g, ' ')
	.replace(/^ (.+) $/, '$1');

/** Predefined options for the unit system */
export enum System {
	/** For when the unit is of the primary system */
	PRIMARY = 'primary',
	/** For when the unit is of the secondary system */
	SECONDARY = 'secondary',
}

/**
 * All the unit definitions used by the library
 */
export const definitions: UnitDefinition[] = [
	{
		data: [
			{ id: 'gf', multiplier: 9.80665, system: System.PRIMARY },
			{ id: 'm/s2', multiplier: 1, system: System.PRIMARY },
		],
		name: 'acceleration',
		primary: { default: 'g', ratio: 1 },
	},
	{
		data: [
			{ id: 'rad', multiplier: 180 / Math.PI, system: System.PRIMARY },
			{ id: 'deg', multiplier: 1, system: System.PRIMARY },
			{ id: 'grad', multiplier: 9 / 10, system: System.PRIMARY },
			{ id: 'arcmin', multiplier: 1 / 60, system: System.PRIMARY },
			{ id: 'arcsec', multiplier: 1 / 3.6e3, system: System.PRIMARY },
		],
		name: 'angle',
		primary: { default: 'deg', ratio: 1 },
	},
	{
		data: [
			{ id: 'va', multiplier: 1, system: System.PRIMARY },
			{ id: 'miva', multiplier: 1e-3, system: System.PRIMARY },
			{ id: 'kva', multiplier: 1e3, system: System.PRIMARY },
			{ id: 'mva', multiplier: 1e6, system: System.PRIMARY },
			{ id: 'gva', multiplier: 1e9, system: System.PRIMARY },
		],
		name: 'apparentPower',
		primary: { default: 'va', ratio: 1 },
	},
	{
		data: [
			{ id: 'mm2', multiplier: 1e-6, system: System.PRIMARY },
			{ id: 'cm2', multiplier: 1e-4, system: System.PRIMARY },
			{ id: 'm2', multiplier: 1, system: System.PRIMARY },
			{ id: 'dm', multiplier: 1e2, system: System.PRIMARY },
			{ id: 'ha', multiplier: 1e4, system: System.PRIMARY },
			{ id: 'km2', multiplier: 1e6, system: System.PRIMARY },
			{ id: 'in2', multiplier: 1 / 144, system: System.SECONDARY },
			{ id: 'yd2', multiplier: 9, system: System.SECONDARY },
			{ id: 'ft2', multiplier: 1, system: System.SECONDARY },
			{ id: 'ac', multiplier: 43560, system: System.SECONDARY },
			{ id: 'mi2', multiplier: 27878400, system: System.SECONDARY },
		],
		name: 'area',
		primary: { default: 'm2', ratio: 10.7639 },
		secondary: { default: 'ft2', ratio: 1 / 10.76391 },
	},
	{
		data: [
			{ id: 'co', multiplier: 1, system: System.PRIMARY },
			{ id: 'mco', multiplier: 1e-3, system: System.PRIMARY },
			{ id: 'mico', multiplier: 1e-6, system: System.PRIMARY },
			{ id: 'nco', multiplier: 1e-9, system: System.PRIMARY },
			{ id: 'pco', multiplier: 1e-12, system: System.PRIMARY },
		],
		name: 'charge',
		primary: { default: 'co', ratio: 1 },
	},
	{
		data: [
			{ id: 'a', multiplier: 1, system: System.PRIMARY },
			{ id: 'ma', multiplier: 1e-3, system: System.PRIMARY },
			{ id: 'ka', multiplier: 1e3, system: System.PRIMARY },
		],
		name: 'current',
		primary: { default: 'a', ratio: 1 },
	},
	{
		data: [
			{ id: 'b', multiplier: 1, system: System.PRIMARY },
			{ id: 'kb', multiplier: 1024, system: System.PRIMARY },
			{ id: 'mb', multiplier: 1048576, system: System.PRIMARY },
			{ id: 'gb', multiplier: 1073741824, system: System.PRIMARY },
			{ id: 'tb', multiplier: 1099511627776, system: System.PRIMARY },
			{ id: 'by', multiplier: 1, system: System.SECONDARY },
			{ id: 'kby', multiplier: 1024, system: System.SECONDARY },
			{ id: 'mby', multiplier: 1048576, system: System.SECONDARY },
			{ id: 'gby', multiplier: 1073741824, system: System.SECONDARY },
			{ id: 'tby', multiplier: 1099511627776, system: System.SECONDARY },
		],
		name: 'digital',
		primary: { default: 'b', ratio: 1 / 8 },
		secondary: { default: 'by', ratio: 8 },
	},
	{
		data: [
			{ id: 'ea', multiplier: 1, system: System.PRIMARY },
			{ id: 'dz', multiplier: 12, system: System.PRIMARY },
		],
		name: 'each',
		primary: { default: 'ea', ratio: 1 },
	},
	{
		data: [
			{ id: 'j', multiplier: 1, system: System.PRIMARY },
			{ id: 'kj', multiplier: 1e3, system: System.PRIMARY },
			{ id: 'wh', multiplier: 3.6e3, system: System.PRIMARY },
			{ id: 'miwh', multiplier: 3.6, system: System.PRIMARY },
			{ id: 'kwh', multiplier: 3.6e6, system: System.PRIMARY },
			{ id: 'mwh', multiplier: 3.6e9, system: System.PRIMARY },
			{ id: 'gwh', multiplier: 3.6e12, system: System.PRIMARY },
		],
		name: 'energy',
		primary: { default: 'j', ratio: 1 },
	},
	{
		data: [
			{ id: 'n', multiplier: 1, system: System.PRIMARY },
			{ id: 'kn', multiplier: 1e3, system: System.PRIMARY },
			{ id: 'lbf', multiplier: 4.44822, system: System.PRIMARY },
		],
		name: 'force',
		primary: { default: 'n', ratio: 1 },
	},
	{
		data: [
			{ id: 'mihz', multiplier: 1e-3, system: System.PRIMARY },
			{ id: 'hz', multiplier: 1, system: System.PRIMARY },
			{ id: 'khz', multiplier: 1e3, system: System.PRIMARY },
			{ id: 'mhz', multiplier: 1e6, system: System.PRIMARY },
			{ id: 'ghz', multiplier: 1e9, system: System.PRIMARY },
			{ id: 'thz', multiplier: 1e12, system: System.PRIMARY },
			{ id: 'rpm', multiplier: 1 / 60, system: System.PRIMARY },
			{ id: 'deg/s', multiplier: 1 / 3.6e2, system: System.PRIMARY },
			{ id: 'rad/s', multiplier: 1 / (Math.PI * 2), system: System.PRIMARY },
		],
		name: 'frequency',
		primary: { default: 'hz', ratio: 1 },
	},
	{
		data: [
			{ id: 'lx', multiplier: 1, system: System.PRIMARY },
			{ id: 'ft-cd', multiplier: 1, system: System.SECONDARY },
		],
		name: 'illuminance',
		primary: { default: 'lx', ratio: 1 / 10.76391 },
		secondary: { default: 'ft-cd', ratio: 10.76391 },
	},
	{
		data: [
			{ id: 'mm', multiplier: 1e-3, system: System.PRIMARY },
			{ id: 'cm', multiplier: 1e-2, system: System.PRIMARY },
			{ id: 'dm', multiplier: 1e-1, system: System.PRIMARY },
			{ id: 'm', multiplier: 1, system: System.PRIMARY },
			{ id: 'dem', multiplier: 10, system: System.PRIMARY },
			{ id: 'hm', multiplier: 100, system: System.PRIMARY },
			{ id: 'km', multiplier: 1e3, system: System.PRIMARY },
			{ id: 'in', multiplier: 12, system: System.SECONDARY },
			{ id: 'yd', multiplier: 3, system: System.SECONDARY },
			{ id: 'ft-us', multiplier: 1.000002, system: System.SECONDARY },
			{ id: 'ft', multiplier: 1, system: System.SECONDARY },
			{
				id: 'fti',
				multiplier: 1,
				system: System.SECONDARY,
				uniqueTransform: (value: number): string =>
					`
				${Math.floor(value)} ${Math.floor(value) === 1 ? 'foot' : 'feet'}
				and ${roundNumber((value % 1) * 12, 0)} inches
			  `
						.replace(/(?:\n\s*)+/g, ' ')
						.replace(/^ (.+) $/, '$1'),
			},
			{ id: 'fathom', multiplier: 6, system: System.SECONDARY },
			{ id: 'mi', multiplier: 5280, system: System.SECONDARY },
			{ id: 'nmi', multiplier: 6076.12, system: System.SECONDARY },
		],
		name: 'length',
		primary: { default: 'm', ratio: 3.28084 },
		secondary: { default: 'ft', ratio: 1 / 3.28084 },
	},
	{
		data: [
			{ id: 'mcg', multiplier: 1e-6, system: System.PRIMARY },
			{ id: 'mg', multiplier: 1e-3, system: System.PRIMARY },
			{ id: 'g', multiplier: 1, system: System.PRIMARY },
			{ id: 'kg', multiplier: 1000, system: System.PRIMARY },
			{ id: 'mt', multiplier: 1e6, system: System.PRIMARY },
			{ id: 'oz', multiplier: 1 / 16, system: System.SECONDARY },
			{ id: 'lb', multiplier: 1, system: System.SECONDARY },
			{ id: 't', multiplier: 2e3, system: System.SECONDARY },
		],
		name: 'mass',
		primary: { default: 'g', ratio: 1 / 453.592 },
		secondary: { default: 'lb', ratio: 453.592 },
	},
	{
		data: [
			{ id: 'min/km', multiplier: 0.06, system: System.PRIMARY },
			{ id: 's/m', multiplier: 1, system: System.PRIMARY },
			{ id: 'min/min', multiplier: 0.0113636, system: System.SECONDARY },
			{ id: 's/ft', multiplier: 1, system: System.SECONDARY },
		],
		name: 'pace',
		primary: { default: 's/m', ratio: 0.3048 },
		secondary: { default: 's/ft', ratio: 1 / 0.3048 },
	},
	{
		data: [
			{ id: 'ppm', multiplier: 1, system: System.PRIMARY },
			{ id: 'ppb', multiplier: 1e-3, system: System.PRIMARY },
			{ id: 'ppt', multiplier: 1e-6, system: System.PRIMARY },
			{ id: 'ppq', multiplier: 1e-9, system: System.PRIMARY },
		],
		name: 'partsPer',
		primary: { default: 'ppm', ratio: 1e-6 },
	},
	{
		data: [
			{ id: 'w', multiplier: 1, system: System.PRIMARY },
			{ id: 'miw', multiplier: 1e-3, system: System.PRIMARY },
			{ id: 'kw', multiplier: 1e3, system: System.PRIMARY },
			{ id: 'mew', multiplier: 1e6, system: System.PRIMARY },
			{ id: 'gw', multiplier: 1e9, system: System.PRIMARY },
		],
		name: 'power',
		primary: { default: 'w', ratio: 1 },
	},
	{
		data: [
			{ id: 'pa', multiplier: 1e-3, system: System.PRIMARY },
			{ id: 'hpa', multiplier: 1e-1, system: System.PRIMARY },
			{ id: 'kpa', multiplier: 1, system: System.PRIMARY },
			{ id: 'mpa', multiplier: 1e3, system: System.PRIMARY },
			{ id: 'bar', multiplier: 100, system: System.PRIMARY },
			{ id: 'torr', multiplier: 101325 / 760000, system: System.PRIMARY },
			{ id: 'psi', multiplier: 1e-3, system: System.SECONDARY },
			{ id: 'ksi', multiplier: 1, system: System.SECONDARY },
		],
		name: 'pressure',
		primary: { default: 'kpa', ratio: 0.00014503768078 },
		secondary: { default: 'psi', ratio: 1 / 0.00014503768078 },
	},
	{
		data: [
			{ id: 'varh', multiplier: 1, system: System.PRIMARY },
			{ id: 'mivarh', multiplier: 1e-3, system: System.PRIMARY },
			{ id: 'kvarh', multiplier: 1e3, system: System.PRIMARY },
			{ id: 'mvarh', multiplier: 1e6, system: System.PRIMARY },
			{ id: 'gvarh', multiplier: 1e9, system: System.PRIMARY },
		],
		name: 'reactiveEnergy',
		primary: { default: 'varh', ratio: 1 },
	},
	{
		data: [
			{ id: 'var', multiplier: 1, system: System.PRIMARY },
			{ id: 'mivar', multiplier: 1e-3, system: System.PRIMARY },
			{ id: 'kvar', multiplier: 1e3, system: System.PRIMARY },
			{ id: 'mvar', multiplier: 1e6, system: System.PRIMARY },
			{ id: 'gvar', multiplier: 1e9, system: System.PRIMARY },
		],
		name: 'reactivePower',
		primary: { default: 'var', ratio: 1 },
	},
	{
		data: [
			{ id: 'm/s', multiplier: 3.6, system: System.PRIMARY },
			{ id: 'km/h', multiplier: 1, system: System.PRIMARY },
			{ id: 'mph', multiplier: 1, system: System.SECONDARY },
			{ id: 'knot', multiplier: 1.150779, system: System.SECONDARY },
			{ id: 'ft/s', multiplier: 0.681818, system: System.SECONDARY },
		],
		name: 'speed',
		primary: { default: 'km/h', ratio: 1 / 1.609344 },
		secondary: { default: 'mph', ratio: 1.609344 },
	},
	{
		data: [
			{
				id: 'c',
				multiplier: 1,
				system: System.PRIMARY,
				valueShift: 0,
			},
			{
				id: 'k',
				multiplier: 1,
				system: System.PRIMARY,
				valueShift: 273.15,
			},
			{
				id: 'f',
				multiplier: 1,
				system: System.SECONDARY,
				valueShift: 0,
			},
			{
				id: 'r',
				multiplier: 1,
				system: System.SECONDARY,
				valueShift: 459.67,
			},
		],
		name: 'temperature',
		primary: { default: 'c', ratio: 1, transform: (celcius): number => (Number(celcius) * 9) / 5 + 32 },
		secondary: { default: 'f', ratio: 1, transform: (fahrenheit): number => (Number(fahrenheit) - 32) * (5 / 9) },
	},
	{
		data: [
			{ id: 'ns', multiplier: 1e-9, system: System.PRIMARY },
			{ id: 'mu', multiplier: 1e-6, system: System.PRIMARY },
			{ id: 'ms', multiplier: 1e-3, system: System.PRIMARY },
			{ id: 'min', multiplier: 60, system: System.PRIMARY },
			{ id: 'h', multiplier: 60 * 60, system: System.PRIMARY },
			{ id: 'd', multiplier: 60 * 60 * 24, system: System.PRIMARY },
			{ id: 'week', multiplier: 60 * 60 * 24 * 7, system: System.PRIMARY },
			{ id: 'month', multiplier: (60 * 60 * 24 * 365.25) / 12, system: System.PRIMARY },
			{ id: 'year', multiplier: 60 * 60 * 24 * 365.25, system: System.PRIMARY },
		],
		name: 'time',
		primary: { default: 's', ratio: 1 },
	},
	{
		data: [
			{ id: 'v', multiplier: 1, system: System.PRIMARY },
			{ id: 'mv', multiplier: 1e-3, system: System.PRIMARY },
			{ id: 'kv', multiplier: 1e3, system: System.PRIMARY },
		],
		name: 'voltage',
		primary: { default: 'v', ratio: 1 },
	},
	{
		data: [
			{ id: 'mm3', multiplier: 1e-6, system: System.PRIMARY },
			{ id: 'cm3', multiplier: 1e-4, system: System.PRIMARY },
			{ id: 'ml', multiplier: 1e-4, system: System.PRIMARY },
			{ id: 'cl', multiplier: 1e-2, system: System.PRIMARY },
			{ id: 'dl', multiplier: 1e-1, system: System.PRIMARY },
			{ id: 'l', multiplier: 1, system: System.PRIMARY },
			{ id: 'kl', multiplier: 1e3, system: System.PRIMARY },
			{ id: 'm3', multiplier: 1e3, system: System.PRIMARY },
			{ id: 'km3', multiplier: 1e12, system: System.PRIMARY },
			{ id: 'tsp', multiplier: 1 / 6, system: System.SECONDARY },
			{ id: 'tbs', multiplier: 1 / 2, system: System.SECONDARY },
			{ id: 'in3', multiplier: 0.55411, system: System.SECONDARY },
			{ id: 'fl-oz', multiplier: 1, system: System.SECONDARY },
			{ id: 'cup', multiplier: 8, system: System.SECONDARY },
			{ id: 'pnt', multiplier: 16, system: System.SECONDARY },
			{ id: 'qt', multiplier: 32, system: System.SECONDARY },
			{ id: 'gal', multiplier: 128, system: System.SECONDARY },
			{ id: 'ft3', multiplier: 957.506, system: System.SECONDARY },
			{ id: 'yd3', multiplier: 25852.7, system: System.SECONDARY },
		],
		name: 'volume',
		primary: { default: 'l', ratio: 33.8140227 },
		secondary: { default: 'fl-oz', ratio: 1 / 33.8140227 },
	},
	{
		data: [
			{ id: 'mm3/s', multiplier: 1e-6, system: System.PRIMARY },
			{ id: 'cm3/s', multiplier: 1e-4, system: System.PRIMARY },
			{ id: 'ml/s', multiplier: 1e-4, system: System.PRIMARY },
			{ id: 'cl/s', multiplier: 1e-2, system: System.PRIMARY },
			{ id: 'dl/s', multiplier: 1e-1, system: System.PRIMARY },
			{ id: 'l/s', multiplier: 1, system: System.PRIMARY },
			{ id: 'l/min', multiplier: 1 / 60, system: System.PRIMARY },
			{ id: 'l/h', multiplier: 1 / 3.6e3, system: System.PRIMARY },
			{ id: 'kl/s', multiplier: 1e3, system: System.PRIMARY },
			{ id: 'kl/min', multiplier: 50 / 3, system: System.PRIMARY },
			{ id: 'kl/h', multiplier: 5 / 18, system: System.PRIMARY },
			{ id: 'm3/s', multiplier: 1e3, system: System.PRIMARY },
			{ id: 'm3/min', multiplier: 50 / 3, system: System.PRIMARY },
			{ id: 'm3/h', multiplier: 5 / 18, system: System.PRIMARY },
			{ id: 'km3/h', multiplier: 1e12, system: System.PRIMARY },
			{ id: 'tsp/s', multiplier: 1 / 6, system: System.SECONDARY },
			{ id: 'tbs/s', multiplier: 1 / 2, system: System.SECONDARY },
			{ id: 'in3/s', multiplier: 0.55411, system: System.SECONDARY },
			{ id: 'in3/min', multiplier: 0.55411 / 60, system: System.SECONDARY },
			{ id: 'in3/h', multiplier: 0.55411 / 3.6e3, system: System.SECONDARY },
			{ id: 'fl-oz/s', multiplier: 1, system: System.SECONDARY },
			{ id: 'fl-oz/min', multiplier: 1 / 60, system: System.SECONDARY },
			{ id: 'fl-oz/h', multiplier: 1 / 3.6e3, system: System.SECONDARY },
			{ id: 'cup/s', multiplier: 8, system: System.SECONDARY },
			{ id: 'pnt/s', multiplier: 16, system: System.SECONDARY },
			{ id: 'pnt/min', multiplier: 16 / 60, system: System.SECONDARY },
			{ id: 'pnt/h', multiplier: 16 / 3.6e3, system: System.SECONDARY },
			{ id: 'qt/s', multiplier: 32, system: System.SECONDARY },
			{ id: 'gal/s', multiplier: 128, system: System.SECONDARY },
			{ id: 'gal/min', multiplier: 128 / 60, system: System.SECONDARY },
			{ id: 'gal/h', multiplier: 128 / 3.6e3, system: System.SECONDARY },
			{ id: 'ft3/s', multiplier: 957.506, system: System.SECONDARY },
			{ id: 'ft3/min', multiplier: 957.506 / 60, system: System.SECONDARY },
			{ id: 'ft3/h', multiplier: 957.506 / 3.6e3, system: System.SECONDARY },
			{ id: 'yd3/s', multiplier: 25852.7, system: System.SECONDARY },
			{ id: 'yd3/min', multiplier: 25852.7 / 60, system: System.SECONDARY },
			{ id: 'yd3/h', multiplier: 25852.7 / 3.6e3, system: System.SECONDARY },
		],
		name: 'volumeFlowRate',
		primary: { default: 'l/s', ratio: 33.8140227 },
		secondary: { default: 'fl-oz/s', ratio: 1 / 33.8140227 },
	},
];

export enum ConverterErrorType {
	MissingInput = 'MISSING_INPUT',
	ValueNotNumber = 'VALUE_NOT_NUMBER',
	FromUnitNotString = 'FROM_UNIT_NOT_STRING',
	ToUnitNotString = 'TO_UNIT_NOT_STRING',
	FromUnitNotSupported = 'FROM_UNIT_NOT_SUPPORTED',
	ToUnitNotSupported = 'TO_UNIT_NOT_SUPPORTED',
	NoDataFound = 'NO_DATA_FOUND',
	FromUnitHasUniqueTransform = 'FROM_UNIT_HAS_UNIQUE_TRANSFORM',
}

export class ConverterError extends Error {
	/**
	 * The type of the error that was thrown.
	 */
	public readonly type: ConverterErrorType;

	public constructor(type: ConverterErrorType, message: string) {
		super(message);
		this.type = type;
	}

	public override get name(): string {
		return `${super.name} [${this.type}]`;
	}
}

/**
 * Converts input from one unit to another unit
 *
 * @param value The input value to convert
 * @param fromUnit The unit to convert from
 * @param toUnit The unit to convert to
 * @param options Options for the conversion
 * @returns Will return a number if the function succeeded or a string with an error message if not
 * @throws A {@link ConverterError `ConverterError`} with an error message and type.
 * @example
 * ```ts
 * convert(5, 'm', 'ft')
 * ```
 *
 * @example
 * ```ts
 * convert(5, 'c', 'f', { precision: 2 })
 * ```
 * @public
 */
export function convert(value: number, fromUnit: string, toUnit: string, options: ConvertOptions = { precision: 8 }): number | string {
	if (!value || !fromUnit || !toUnit)
		throw new ConverterError(ConverterErrorType.MissingInput, 'some input arguments are absent, please supply all arguments');
	if (typeof value !== 'number')
		throw new ConverterError(ConverterErrorType.ValueNotNumber, `the input value (${value}) is not of type number`);
	if (typeof fromUnit !== 'string')
		throw new ConverterError(ConverterErrorType.FromUnitNotString, `the fromUnit (${fromUnit}) is not of type string`);
	if (typeof toUnit !== 'string')
		throw new ConverterError(ConverterErrorType.ToUnitNotString, `the toUnit (${toUnit}) is not of type string`);

	const supportedIds = Object.values(definitions).map((definition: UnitDefinition) => definition.data.map((data: UnitData) => data.id)).flat();

	if (!supportedIds.includes(fromUnit))
		throw new ConverterError(ConverterErrorType.FromUnitNotSupported, `the fromUnit (${fromUnit}) is not supported by this library`);
	if (!supportedIds.includes(fromUnit))
		throw new ConverterError(ConverterErrorType.ToUnitNotSupported, `the toUnit (${toUnit}) is not supported by this library`);
	if (fromUnit === toUnit)
		return value;

	let definitionData: UnitDefinition = {
		data: [{ id: '', multiplier: 1, system: System.PRIMARY }],
		name: '',
		primary: { default: '', ratio: 1, transform: undefined },
		secondary: { default: '', ratio: 1, transform: undefined },
	};

	Object.values(definitions).forEach((d) => {
		const idsInDefinition = d.data.map((unit: UnitData) => unit.id);
		if (idsInDefinition.includes(fromUnit) && idsInDefinition.includes(toUnit))
			definitionData = d;
	});

	if (!definitionData.name)
		throw new ConverterError(ConverterErrorType.NoDataFound, `cannot convert incompatible unit of fromUnit (${fromUnit}) to toUnit (${toUnit})`);

	const fromData = definitionData.data.find(unit => unit.id === fromUnit);
	const toData = definitionData.data.find(unit => unit.id === toUnit);
	if (!fromData)
		throw new ConverterError(ConverterErrorType.FromUnitNotSupported, `the fromUnit (${fromUnit}) is not supported by this library`);
	if (!toData)
		throw new ConverterError(ConverterErrorType.ToUnitNotSupported, `the toUnit (${toUnit}) is not supported by this library`);
	if (fromData.uniqueTransform)
		throw new ConverterError(ConverterErrorType.FromUnitHasUniqueTransform, uniqueTransformError);

	let result = value * fromData.multiplier;
	if (fromData.valueShift)
		result -= fromData.valueShift;

	if (fromData.system !== toData.system) {
		const { transform } = definitionData[fromData.system]!;
		if (typeof transform === 'function')
			result = transform(result);
		else result *= definitionData[fromData.system]!.ratio;
	}

	if (toData.valueShift)
		result += toData.valueShift;
	if (toData.uniqueTransform)
		return toData.uniqueTransform(result);
	return roundNumber(result / toData.multiplier, options.precision);
}

/** Measure system data */
export interface MeasurementSystemData {
	/** The default unit to use */
	default: string;
	/** The ratio to convert to other measurement system */
	ratio: number;

	/** A transformation function when a simple ratio is not enough */
	transform?: (arg: string | number) => number;
}

/** Array of supported unit definitions */
export interface UnitDefinition {
	/** Name of the unit definition */
	name: string;
	/** Primary measurement system data */
	primary: MeasurementSystemData;
	/** Secondary measurement system data */
	secondary?: MeasurementSystemData;
	/** Unit data that belongs to this unit's definition */
	data: UnitData[];
}

/** Single property of definitions */
export interface UnitData {
	/** ID of the unit */
	id: string;
	/** Whether the unit is of primary or secondary system */
	system: System;
	/** Multiplier for the unit */
	multiplier: number;
	/** A zero value shift to use instead of a multiplier */
	valueShift?: number;
	/**
	 * A unique transformation when default ratio and multiplier do not apply.
	 *
	 * @returns the final value returned by the convertion
	 */
	uniqueTransform?: (value: number) => string;
}

/** Options for the convert method */
export interface ConvertOptions {
	/** The decimal precision to return */
	precision: number;
}

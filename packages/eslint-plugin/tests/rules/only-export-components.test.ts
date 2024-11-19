import type { InvalidTestCase, ValidTestCase } from 'eslint-vitest-rule-tester';
import rule, { RULE_NAME } from '../../src/rules/only-export-components';
import { $, run } from '../utilities';

const valids: ValidTestCase[] = [
	{
		code: 'export function Foo() {};',
		name: 'Direct export named component',
	},
	{
		code: 'function Foo() {}; export { Foo };',
		name: 'Export named component',
	},
	{
		code: 'function Foo() {}; export default Foo;',
		name: 'Export default named component',
	},
	{
		code: 'export default function Foo() {}',
		name: 'Direct export default named component',
	},
	{
		code: 'export const Foo = () => {};',
		name: 'Direct export AF component',
	},
	{
		code: 'export const Foo2 = () => {};',
		name: 'Direct export AF component with number',
	},
	{
		code: 'export function CMS() {};',
		name: 'Direct export uppercase function',
	},
	{
		code: 'export const SVG = forwardRef(() => <svg/>);',
		name: 'Uppercase component with forwardRef',
	},
	{
		code: 'export const CMS = () => {};',
		name: 'Direct export uppercase component',
	},
	{
		code: 'const Foo = () => {}; export { Foo };',
		name: 'Export AF component',
	},
	{
		code: 'const Foo = () => {}; export default Foo;',
		name: 'Default export AF component',
	},
	{
		code: 'const foo = 4; export const Bar = () => {}; export const Baz = () => {};',
		name: 'Two components & local variable',
	},
	{
		code: 'const foo = () => {}; export const Bar = () => {}; export const Baz = () => {};',
		name: 'Two components & local function',
	},
	{
		code: 'export const Foo = () => {}; export const Bar = styled.div`padding-bottom: 6px;`;',
		name: 'styled components',
	},
	{
		code: 'export const foo = 3;',
		name: 'Direct export variable',
	},
	{
		code: 'const foo = 3; const bar = \'Hello\'; export { foo, bar };',
		name: 'Export variables',
	},
	{
		code: 'export const foo = () => {};',
		name: 'Direct export AF',
	},
	{
		code: 'export default function foo () {};',
		name: 'Direct export default AF',
	},
	{
		code: 'export default memo(function Foo () {});',
		name: 'export default memo function',
	},
	{
		code: 'export default React.memo(function Foo () {});',
		name: 'export default React.memo function',
	},
	{
		code: 'const Foo = () => {}; export default memo(Foo);',
		name: 'export default memo function assignment',
	},
	{
		code: 'const Foo = () => {}; export default React.memo(Foo);',
		name: 'export default React.memo function assignment',
	},
	{
		code: 'function Foo() {}; export default memo(Foo);',
		name: 'export default memo function declaration',
	},
	{
		code: 'function Foo() {}; export default React.memo(Foo);',
		name: 'export default React.memo function declaration',
	},
	{
		code: 'function Foo() {}; export default React.memo(Foo) as typeof Foo;',
		name: 'export default React.memo function declaration with type assertion',
	},
	{
		code: 'export type * from \'./module\';',
		filename: 'Test.tsx',
		name: 'export type *',
	},
	{
		code: 'type foo = string; export const Foo = () => null; export type { foo };',
		filename: 'Test.tsx',
		name: 'export type { foo }',
	},
	{
		code: 'export type foo = string; export const Foo = () => null;',
		filename: 'Test.tsx',
		name: 'export type foo',
	},
	{
		code: 'export const foo = () => {}; export const Bar = () => {};',
		filename: 'Test.js',
		name: 'Mixed export in JS without checkJS',
	},
	{
		code: 'export const foo = () => {}; export const Bar = () => {};',
		filename: 'Test.js',
		name: 'Mixed export in JS without react import',
		options: [{ checkJS: true }],
	},
	{
		code: 'export const foo = 4; export const Bar = () => {};',
		name: 'Component and number constant with allowConstantExport',
		options: [{ allowConstantExport: true }],
	},
	{
		code: 'export const foo = -4; export const Bar = () => {};',
		name: 'Component and negative number constant with allowConstantExport',
		options: [{ allowConstantExport: true }],
	},
	{
		code: 'export const CONSTANT = \'Hello world\'; export const Foo = () => {};',
		name: 'Component and string constant with allowConstantExport',
		options: [{ allowConstantExport: true }],
	},
	{
		// eslint-disable-next-line no-template-curly-in-string -- used in test
		code: 'const foo = \'world\'; export const CONSTANT = \`Hello ${foo}\`; export const Foo = () => {};',
		name: 'Component and template literal with allowConstantExport',
		options: [{ allowConstantExport: true }],
	},
	{
		code: 'export const loader = () => {}; export const Bar = () => {};',
		name: 'Component and allowed export',
		options: [{ allowExportNames: ['loader', 'meta'] }],
	},
	{
		code: 'export function loader() {}; export const Bar = () => {};',
		name: 'Component and allowed function export',
		options: [{ allowExportNames: ['loader', 'meta'] }],
	},
	{
		code: 'export const loader = () => {}; export const meta = { title: \'Home\' };',
		name: 'Only allowed exports without component',
		options: [{ allowExportNames: ['loader', 'meta'] }],
	},
	{
		code: 'export { App as default }; const App = () => <>Test</>;',
		name: 'Export as default',
	},
	{
		code: 'const MyComponent = () => {}; export default connect(() => ({}))(MyComponent);',
		name: 'Allow connect from react-redux',
	},
	{
		name: 'Two components, one of them with \'Context\' in its name',
		code: 'export const MyComponent = () => {}; export const ChatContext = () => {};',
	},
	{
		name: 'Component & local React context',
		code: 'export const MyComponent = () => {}; const MyContext = createContext(\'test\');',
	},
	{
		name: 'Only React context',
		code: 'export const MyContext = createContext(\'test\');',
	},
];

const invalid: InvalidTestCase[] = [
	{
		code: 'export const foo = () => {}; export const Bar = () => {};',
		errors: [{ messageId: 'namedExport' }],
		name: 'Component and function',
	},
	{
		code: 'export const foo = () => {}; export const Bar = () => {};',
		errors: [{ messageId: 'namedExport' }],
		name: 'Component and function with allowConstantExport',
		options: [{ allowConstantExport: true }],
	},
	{
		code: 'export const foo = 4; export const Bar = () => {};',
		errors: [{ messageId: 'namedExport' }],
		name: 'Component and variable (direct export)',
	},
	{
		code: 'export function Component() {}; export const Aa = \'a\'',
		errors: [{ messageId: 'namedExport' }],
		name: 'Component and PascalCase variable',
	},
	{
		code: 'const foo = 4; const Bar = () => {}; export { foo, Bar };',
		errors: [{ messageId: 'namedExport' }],
		name: 'Component and variable',
	},
	{
		code: 'export * from \'./foo\';',
		errors: [{ messageId: 'exportAll' }],
		name: 'Export all',
	},
	{
		code: 'export default () => {};',
		errors: [{ messageId: 'anonymousExport' }],
		name: 'Export default anonymous AF',
	},
	{
		code: 'export default memo(() => {});',
		errors: [{ messageId: 'anonymousExport' }],
		name: 'export default anonymous memo AF',
	},
	{
		code: 'export default function () {};',
		errors: [{ messageId: 'anonymousExport' }],
		name: 'Export default anonymous function',
	},
	{
		code: 'export const CONSTANT = 3; export const Foo = () => {};',
		errors: [{ messageId: 'namedExport' }],
		name: 'Component and constant',
	},
	{
		code: 'export enum Tab { Home, Settings }; export const Bar = () => {};',
		errors: [{ messageId: 'namedExport' }],
		name: 'Component and enum',
	},
	{
		code: 'const Tab = () => {}; export const tabs = [<Tab />, <Tab />];',
		errors: [{ messageId: 'localComponents' }],
		name: 'Unexported component and export',
	},
	{
		code: $`
			import React from 'react';
			export const CONSTANT = 3; export const Foo = () => {};
		`,
		errors: [{ messageId: 'namedExport' }],
		filename: 'Test.js',
		name: 'Mixed export in JS with react import',
		options: [{ checkJS: true }],
	},
	{
		code: 'export default compose()(MainView);',
		errors: [{ messageId: 'anonymousExport' }],
		filename: 'Test.jsx',
		name: 'export default compose',
	},
	{
		code: 'export const loader = () => {}; export const Bar = () => {}; export const foo = () => {};',
		errors: [{ messageId: 'namedExport' }],
		name: 'Component and export non in allowExportNames',
		options: [{ allowExportNames: ['loader', 'meta'] }],
	},
	{
		code: 'const Foo = () => {}; export { Foo as "🍌"}',
		errors: [{ messageId: 'localComponents' }],
		name: 'Export with arbitrary module identifier',
	},
	{
		errors: [{ messageId: 'reactContext' }],
		code: 'export const MyComponent = () => {}; export const MyContext = createContext("test");',
		name: 'Component and React Context',
	},
	{
		name: 'Component and React Context with React import',
		code: 'export const MyComponent = () => {}; export const MyContext = React.createContext(\'test\');',
		errors: [{ messageId: 'reactContext' }],
	},
];

run({
	invalid: invalid.map((i) => {
		if (typeof i === 'string')
			return {
				code: i,
				filename: 'Test.jsx',
			};
		i.filename = i.filename ?? 'Test.jsx';
		return i;
	}),
	name: RULE_NAME,

	parserOptions: {
		ecmaFeatures: { jsx: true },
	},
	rule,

	valid: valids.map((i) => {
		if (typeof i === 'string')
			return {
				code: i,
				filename: 'Test.jsx',
			};
		i.filename = i.filename ?? 'Test.jsx';
		return i;
	}),
});

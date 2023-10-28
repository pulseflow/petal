import globals from 'globals';

/** @type {import('eslint').Linter.FlatConfig} */
export default {
	env: {
		es6: true,
	},
	languageOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true,
		},
		globals: {
			...globals.es2021,
			...globals.es2020,
			...globals.browser,
			...globals.node,
		},
	},
	rules: {
		// require parens in arrow function arguments
		'arrow-parens': 0,
		// require space before/after arrow function's arrow
		'arrow-spacing': 0,
		// verify super() callings in constructors
		'constructor-super': 0,
		// enforce the spacing around the * in generator functions
		'generator-star-spacing': 0,
		// disallow modifying variables of class declarations
		'no-class-assign': 0,
		// disallow modifying variables that are declared using const
		'no-const-assign': 2,
		// disallow to use this/super before super() calling in constructors.
		'no-this-before-super': 0,
		// disallow empty constructors and constructors that only delegate into the parent class.
		'no-useless-constructor': 2,
		// require let or const instead of var
		'no-var': 2,
		// require method and property shorthand syntax for object literals
		'object-shorthand': 0,
		// suggest using of const declaration for variables that are never modified after declared
		'prefer-const': 2,
		// suggest using the spread operator instead of .apply()
		'prefer-spread': 0,
		// suggest using Reflect methods where applicable
		'prefer-reflect': 0,
		// suggest using template strings instead of concatenation or joining
		'prefer-template': 2,
		// disallow generator functions that do not have yield
		'require-yield': 0,
		// disallow trailing commas in object literals
		'comma-dangle': [2, 'always-multiline'],
		'no-tabs': 'off',
	},
};

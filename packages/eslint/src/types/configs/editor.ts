export interface OptionsProjectType {
	/**
	 * Type of the project. `'lib'` will enable more strict rules for libraries.
	 *
	 * @default 'app'
	 */
	type?: 'app' | 'lib';
}

export interface OptionsIsInEditor {
	/**
	 * Control to disable some testing rules in editors.
	 *
	 * @default auto-detect based on the process.env
	 */
	isInEditor?: boolean;
}

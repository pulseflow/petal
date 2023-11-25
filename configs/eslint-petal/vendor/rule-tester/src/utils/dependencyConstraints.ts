import * as semver from 'semver';

import type {
	DependencyConstraint,
	SemverVersionConstraint,
} from '../types/DependencyConstraint.js';

const BASE_SATISFIES_OPTIONS: semver.RangeOptions = {
	includePrerelease: true,
};

async function satisfiesDependencyConstraint(
	packageName: string,
	constraintIn: DependencyConstraint[string],
): Promise<boolean> {
	const constraint: SemverVersionConstraint
    = typeof constraintIn === 'string'
    	? {
    			range: `>=${constraintIn}`,
    		}
    	: constraintIn;

	return semver.satisfies(
		(await import(`${packageName}/package.json`) as { version: string }).version,
		constraint.range,
		typeof constraint.options === 'object'
			? { ...BASE_SATISFIES_OPTIONS, ...constraint.options }
			: constraint.options,
	);
}

export async function satisfiesAllDependencyConstraints(
	dependencyConstraints: DependencyConstraint | undefined,
): Promise<boolean> {
	if (dependencyConstraints == null)
		return true;

	for (const [packageName, constraint] of Object.entries(
		dependencyConstraints,
	)) {
		if (!await satisfiesDependencyConstraint(packageName, constraint))
			return false;
	}

	return true;
}

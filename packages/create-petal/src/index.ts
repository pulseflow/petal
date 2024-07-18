import process from 'node:process';
import { consola } from 'consola';

export async function main(_cwd = process.cwd(), _argv = process.argv): Promise<void> {
	const currentVersion = process.versions.node;
	const requiredMajorVersion = Number.parseInt(currentVersion.split('.')[0], 10);
	const minimumMajorVersion = 20;

	if (requiredMajorVersion < minimumMajorVersion) {
		consola.error(`Node.js v${currentVersion} is out of date and unsupported!`);
		consola.error(`Please use Node.js v${minimumMajorVersion} or higher.`);
		process.exit(1);
	}

	consola.log('hi');
}

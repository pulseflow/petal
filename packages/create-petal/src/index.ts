import process from 'node:process';

export async function main(_cwd = process.cwd(), _argv = process.argv): Promise<void> {
	const currentVersion = process.versions.node;
	const requiredMajorVersion = Number.parseInt(currentVersion.split('.')[0], 10);
	const minimumMajorVersion = 20;

	if (requiredMajorVersion < minimumMajorVersion) {
		console.error(`Node.js v${currentVersion} is out of date and unsupported!`);
		console.error(`Please use Node.js v${minimumMajorVersion} or higher.`);
		process.exit(1);
	}
}

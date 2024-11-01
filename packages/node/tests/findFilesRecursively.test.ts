import { join } from 'pathe';
import {
	findFilesRecursively,
	findFilesRecursivelyRegex,
	findFilesRecursivelyStringEndsWith,
	findFilesRecursivelyStringIncludes,
	findFilesRecursivelyStringStartsWith,
} from '../src/lib/findFilesRecursively';

describe('findFilesRecursively', () => {
	it('given a directory name then returns all files in that directory', async () => {
		const files = [];
		for await (const file of findFilesRecursively(join(import.meta.dirname, 'findFilesRecursivelyDemoFiles')))
			files.push(file);

		expect(files.length).toBe(5);
		expect(files.sort((a, b) => a.localeCompare(b))).toStrictEqual([
			join(import.meta.dirname, 'findFilesRecursivelyDemoFiles', 'a.txt'),
			join(import.meta.dirname, 'findFilesRecursivelyDemoFiles', 'file1.txt'),
			join(import.meta.dirname, 'findFilesRecursivelyDemoFiles', 'file2.csv'),
			join(import.meta.dirname, 'findFilesRecursivelyDemoFiles', 'file3.xml'),
			join(import.meta.dirname, 'findFilesRecursivelyDemoFiles', 'nested', 'b.txt'),
		]);
	});
});

describe('findFilesRecursivelyStringStartsWith', () => {
	it('given a directory name and a startsWith value then returns all files that starts with the given value', async () => {
		const files = [];
		for await (const file of findFilesRecursivelyStringStartsWith(join(import.meta.dirname, 'findFilesRecursivelyDemoFiles'), 'file'))
			files.push(file);

		expect(files.length).toBe(3);
		expect(files.sort((a, b) => a.localeCompare(b))).toStrictEqual([
			join(import.meta.dirname, 'findFilesRecursivelyDemoFiles', 'file1.txt'),
			join(import.meta.dirname, 'findFilesRecursivelyDemoFiles', 'file2.csv'),
			join(import.meta.dirname, 'findFilesRecursivelyDemoFiles', 'file3.xml'),
		]);
	});
});

describe('findFilesRecursivelyStringEndsWith', () => {
	it('given a directory name and an endsWith value then returns all files that ends with the given value', async () => {
		const files = [];
		for await (const file of findFilesRecursivelyStringEndsWith(join(import.meta.dirname, 'findFilesRecursivelyDemoFiles'), 'txt'))
			files.push(file);

		expect(files.length).toBe(3);
		expect(files.sort((a, b) => a.localeCompare(b))).toStrictEqual([
			join(import.meta.dirname, 'findFilesRecursivelyDemoFiles', 'a.txt'),
			join(import.meta.dirname, 'findFilesRecursivelyDemoFiles', 'file1.txt'),
			join(import.meta.dirname, 'findFilesRecursivelyDemoFiles', 'nested', 'b.txt'),
		]);
	});
});

describe('findFilesRecursivelyStringIncludes', () => {
	it('given a directory name and a includes value then returns all files that includes the given value', async () => {
		const files = [];
		for await (const file of findFilesRecursivelyStringIncludes(join(import.meta.dirname, 'findFilesRecursivelyDemoFiles'), '1'))
			files.push(file);

		expect(files.length).toBe(1);
		expect(files.sort((a, b) => a.localeCompare(b))).toStrictEqual([join(import.meta.dirname, 'findFilesRecursivelyDemoFiles', 'file1.txt')]);
	});
});

describe('findFilesRecursivelyRegex', () => {
	it('given a directory name and a regex then returns all files that matches the regex', async () => {
		const files = [];
		for await (const file of findFilesRecursivelyRegex(join(import.meta.dirname, 'findFilesRecursivelyDemoFiles'), /^file(?:1|2)/))
			files.push(file);

		expect(files.length).toBe(2);
		expect(files.sort((a, b) => a.localeCompare(b))).toStrictEqual([
			join(import.meta.dirname, 'findFilesRecursivelyDemoFiles', 'file1.txt'),
			join(import.meta.dirname, 'findFilesRecursivelyDemoFiles', 'file2.csv'),
		]);
	});
});

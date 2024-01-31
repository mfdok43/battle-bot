import fs from 'fs';
export class FsOperations {
	res: any;
	fs: any;
	constructor() {
		this.fs = fs;
	}
	read(path: string, format: string): void {
		try {
			this.res = this.fs.readFileSync(path, format);
			return this.res;
		} catch (e: any) {
			console.log(e);
		}
	}
	write(path: string, value: string): void {
		this.fs.writeFileSync(path, value);
	}

	delete(path: string): void {
		this.fs.truncateSync(path);
	}

	watch(path: any, int: any, func: any): void {
		this.fs.watchFile(path, int, func);
	}
}

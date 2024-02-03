import generator from 'generate-password-ts';
import { FsOperations } from '../fs-operations/fs-operations';

export class SavePassword {
	private generatePassword: any;
	private fs: any;

	constructor() {
		this.fs = new FsOperations();
		this.generatePassword = generator;
	}

	passwordInit(): string {
		return this.generatePassword.generate({
			length: 10,
			numbers: true,
		});
	}

	bigIntPasswordInit(): string {
		return this.generatePassword.generate({
			length: 10,
			numbers: true,
			symbols: false,
		});
	}
}

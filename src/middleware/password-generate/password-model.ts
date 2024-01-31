import generator from 'generate-password';
import { FsOperations } from '../../middleware/fs-operations/fs-operations';

export class SavePassword {
	private generatePassword: any;
	private fs: any;

	constructor() {
		this.fs = new FsOperations();
		this.generatePassword = generator;
	}

	init(): void {
		return this.generatePassword.generate({
			length: 10,
			numbers: true,
		});
	}
}

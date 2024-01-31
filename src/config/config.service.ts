import { IConfigService } from './config.interface';
import { config, DotenvParseOutput } from 'dotenv';

export class ConfigService implements IConfigService {
	private readonly config: DotenvParseOutput;
	constructor() {
		const { error, parsed } = config();
		if (error) {
			throw new Error('not found .env');
		}

		if (!parsed) {
			throw new Error('empty file .env');
		}

		this.config = parsed;
	}
	get(key: string): string {
		const res = this.config[key];
		if (!res) {
			throw new Error('not key');
		}
		return res;
	}
}

import { Sequelize, Dialect } from '@sequelize/core';
import { IConfigService, ConfigService } from '../config';
import { User, Battle } from './models';

export class Db {
	sequelize: Sequelize;
	private static instance: Db | null = null;

	private constructor(sequelize: Sequelize) {
		this.sequelize = sequelize;
	}

	static async getDb(): Promise<Db> {
		const configService: IConfigService = new ConfigService();
		if (!this.instance) {
			const database: string = configService.get('POSTGRES_DATABASE');
			const username: string = configService.get('POSTGRES_USERNAME');
			const password: string = configService.get('POSTGRES_PASSWORD');
			const host: string = configService.get('POSTGRES_HOST');
			const port = Number(configService.get('POSTGRES_PORT'));
			const dialect: Dialect = configService.get('POSTGRES_DIALECT') as Dialect;
			const logging: boolean | ((sql: string, timing?: number) => void) = false;


			// const sequelize: Sequelize = new Sequelize(`postgres://${username}:${password}:${port}/${database}`)
			const sequelize: Sequelize = new Sequelize(database, username, password, {
				host,
				port,
				dialect,
				logging,
				models: [User, Battle],
			});
			await sequelize.sync({ alter: true });
			this.instance = new Db(sequelize);
		}
		return this.instance;
	}
}

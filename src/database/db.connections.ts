import { Sequelize, Dialect } from 'sequelize';
import { IDb } from './db.interface';
import { IConfigService, ConfigService } from '../config';
import { user, channel, battle, user_battle } from './models';

export class Db implements IDb {
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

			const sequelize: Sequelize = new Sequelize(database, username, password, {
				host,
				port,
				dialect,
				logging,
			});
			const UserModel = user(sequelize);
			const BattleModel = battle(sequelize);
			const ChannelModel = channel(sequelize);
			const UserBattleModel = user_battle(sequelize);

			UserModel.hasMany(BattleModel);
			BattleModel.belongsTo(UserModel);

			BattleModel.hasMany(UserModel);
			UserModel.belongsTo(BattleModel);

			BattleModel.belongsToMany(UserModel, { through: UserBattleModel });
			UserModel.belongsToMany(BattleModel, { through: UserBattleModel });

			await sequelize.sync({ alter: true });

			this.instance = new Db(sequelize);
		}

		return this.instance;
	}
}

import { IDb } from '../database';
import { ModelStatic } from 'sequelize';

export class UserBattleService {
	private userBattle: any;
	constructor(db: IDb) {
		this.userBattle = db.sequelize.models.user_battle;
	}

	async create(login: string, battleId: string): Promise<any> {
		const [userBattle, created] = await this.userBattle.findOrCreate({
			where: { login: login, battleId: battleId },
		});
		return userBattle;
	}

	async findAll(): Promise<any> {
		const userBattles = await this.userBattle.findAll({ raw: true });
		return userBattles;
	}

	// async addUserToBattle(login: string, battleId: string): Promise<any> {
	// 	const [user, created] = await this.user.findOrCreate({
	// 		where: { login: login, battleId: battleId },
	// 	});
	// 	return user;
	// }
	//
	// async updateRole(login: string, role: string): Promise<any> {
	// 	const user = await this.user.update(
	// 		{ role: role },
	// 		{
	// 			where: {
	// 				login: login,
	// 			},
	// 		},
	// 	);
	// 	console.log('update role ' + user);
	// 	return user;
	// }
	// async delete(login: string): Promise<any> {
	// 	return this.user.destroy({
	// 		where: {
	// 			login: login,
	// 		},
	// 	});
	// }
	//
	// async getById(login: string): Promise<any> {
	// 	const user = await this.user.findOne({ where: { login: login } });
	// 	return user;
	// }
}

import { IDb } from '../database';
import { ModelStatic } from 'sequelize';

export class BattleService {
	private battle: any;
	constructor(db: IDb) {
		this.battle = db.sequelize.models.battle;
	}

	async create(name: string): Promise<any> {
		const [battle, created] = await this.battle.findOrCreate({
			where: { name: name },
		});
		return battle;
	}

	async findAll(): Promise<any> {
		const battles = await this.battle.findAll({ raw: true });
		return battles;
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

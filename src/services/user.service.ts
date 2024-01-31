import { IDb } from '../database';
import { ModelStatic } from 'sequelize';
import { UserRole } from '../database/models/user.model';

export class UserService {
	private user: any;
	constructor(db: IDb) {
		this.user = db.sequelize.models.user;
	}

	async create(login: string, username: string, firstName: string, lastName: string): Promise<any> {
		const userData = {
			login: login,
			username: username,
			firstName: firstName,
			lastName: lastName,
			role: UserRole.User,
		};

		const [user, created] = await this.user.findOrCreate({
			where: { login: login },
			defaults: userData,
		});
		return user;
	}

	async addUserToBattle(login: string, battleId: string): Promise<any> {
		const [user, created] = await this.user.findOrCreate({
			where: { login: login, battleId: battleId },
		});
		return user;
	}

	async updateRole(login: string, role: string): Promise<any> {
		const user = await this.user.update(
			{ role: role },
			{
				where: {
					login: login,
				},
			},
		);
		console.log('update role ' + user);
		return user;
	}
	async delete(login: string): Promise<any> {
		return this.user.destroy({
			where: {
				login: login,
			},
		});
	}

	async getUsers(): Promise<any> {
		const users = await this.user.findAll();
		return users;
	}
	async getById(login: string): Promise<any> {
		const user = await this.user.findOne({ where: { login: login } });
		return user;
	}
}

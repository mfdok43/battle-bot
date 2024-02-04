import {IDb} from '../database';
import {User, UserRole} from '../database/models/user.model';

export class UserService {
	private user: any;
	constructor(db: IDb) {
		this.user = User;
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
					login: login.toString(),
				},
			},
		);
		console.log('update role ' + user);
		return user;
	}
	async delete(login: string): Promise<any> {
		return this.user.destroy({
			where: {
				login: login.toString(),
			},
		});
	}

	async getUsers(): Promise<any> {
		return await this.user.findAll();
	}
	async getById(login: string): Promise<any> {
		return await this.user.findOne({ where: { login: login.toString() } });
	}

	async getAdmins(): Promise<any> {
		const [users] = await Promise.all([
			this.user.findAll({
				where: {
					role: 'admin',
				},
			}),
		]);
		return users;
	}
}

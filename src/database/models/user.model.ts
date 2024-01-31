import {DataTypes, Model, NonAttribute, Sequelize} from 'sequelize';
import {Battle} from "./battle.model";

export enum UserRole {
	User = 'user',
	Battler = 'battler',
	Admin = 'admin',
	SuperAdmin = 'super-admin',
}

class User extends Model {
	declare login: string;
	declare username: string | null;
	declare firstName: string;
	declare lastName: string | null;
	declare role: UserRole;
	declare readyToBattle: boolean | null;
	// declare battles?: NonAttribute<Battle>;
}

export const user = (sequelize: Sequelize) =>
	User.init(
		{
			login: {
				type: DataTypes.STRING,
				primaryKey: true,
				unique: true,
				allowNull: false,
			},
			username: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			firstName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			lastName: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			role: {
				type: DataTypes.STRING,
				defaultValue: UserRole.User,
				allowNull: false,
			},
			readyToBattle: {
				type: DataTypes.STRING,
				defaultValue: false,
				allowNull: true,
			},
		},
		{
			sequelize,
			modelName: 'user',
		},
	);

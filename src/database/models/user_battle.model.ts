import { DataTypes, Model, Sequelize } from 'sequelize';

class UserBattle extends Model {
	declare login: string;
	declare battleId: string;
}

export const user_battle = (sequelize: Sequelize) =>
	UserBattle.init(
		{
			login: {
				type: DataTypes.STRING,
				primaryKey: true,
				allowNull: false,
			},
			battleId: {
				type: DataTypes.UUID,
				primaryKey: true,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: 'user_battle',
			tableName: 'user_battle',
			timestamps: false,
			freezeTableName: true,
		},
	);

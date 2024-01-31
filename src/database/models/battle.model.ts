import { DataTypes, Model, Sequelize } from 'sequelize';
import {IUser} from "../../context";
export enum BattleStatus {
	Planned = 'planned',
	Going = 'going',
	Completed = 'completed',
}
export class Battle extends Model {
	declare id: string;
	declare name: string;
	declare status: BattleStatus;
	declare winner: string | null;
}
export const battle = (sequelize: Sequelize) =>
	Battle.init(
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
				unique: true,
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING,
				primaryKey: true,
				unique: true,
				allowNull: false,
			},
			status: {
				type: DataTypes.STRING,
				defaultValue: BattleStatus.Planned,
				allowNull: false,
			},
			winner: {
				type: DataTypes.STRING,
				allowNull: true,
			},
		},
		{
			sequelize,
			modelName: 'battle',
		},
	);

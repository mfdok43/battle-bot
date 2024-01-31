import { DataTypes, Model, Sequelize } from 'sequelize';
import { IChannel } from '../../context/context.interface';

class Channel extends Model implements IChannel {
	declare id: string;
	declare telegramId: string;
	declare channelTitle: string;
	declare channelName: string | null;
	declare isAdmin: boolean;
}

export const channel = (sequelize: Sequelize) =>
	Channel.init(
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
				unique: true,
				allowNull: false,
			},
			telegramId: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			channelTitle: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			channelName: {
				type: DataTypes.STRING,
				defaultValue: false,
				allowNull: true,
			},
			isAdmin: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: 'channel',
		},
	);

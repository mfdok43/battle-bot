// import { IDb } from '../database';
//
// export class ChannelService {
// 	private channel: any;
// 	constructor(db: IDb) {
// 		this.channel = db.sequelize.models.channel;
// 	}
//
// 	async create(
// 		telegramId: string,
// 		channelTitle: string,
// 		channelName: string,
// 		isAdmin: string,
// 	): Promise<any> {
// 		const channelData = {
// 			telegramId: telegramId,
// 			channelTitle: channelTitle,
// 			channelName: channelName,
// 			isAdmin: isAdmin,
// 		};
//
// 		const [channel, created] = await this.channel.findOrCreate({
// 			where: { telegramId: telegramId },
// 			defaults: channelData,
// 		});
// 		return channel;
// 	}
//
// 	async setChannelAdmin(telegramId: string, value: boolean): Promise<any> {
// 		const channel = await this.channel.update(
// 			{ isAdmin: value },
// 			{ where: { telegramId: telegramId } },
// 		);
// 		return channel;
// 	}
//
// 	async findAll(): Promise<any> {
// 		const channels = await this.channel.findAll({ raw: true });
// 		return channels;
// 	}
// }

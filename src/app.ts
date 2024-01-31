import { Telegraf, Scenes, session } from 'telegraf';
import { ConfigService, IConfigService } from './config';
import { IBotContext } from './context';
import { Db } from './database';
import { Stage } from 'telegraf/typings/scenes';
import { checkRole } from './middleware';
import {
	SendBattlerPassword,
	SendAdminPassword,
	StartCommand,
	SetAdminCommand,
	SetBattlerCommand,
	TGCommand,
	EventTheBattleScene,
	EventTheBattleCommand,
	BackButtonCommand,
	SetAdminScene,
	SetBattlerScene, AnyMessage,
} from './commands';
import { UserService } from './services';
import { ChannelService } from './services/channel.service';
class Bot {
	bot: any;
	stage: Stage<any>;
	commands: TGCommand[] = [];
	scenes: any[];
	channelService: any;
	constructor(private readonly configService: IConfigService) {
		this.bot = new Telegraf<IBotContext>(this.configService.get('TOKEN'));

		this.scenes = [
			new EventTheBattleScene(this.bot),
			new SetAdminScene(this.bot),
			new SetBattlerScene(this.bot),
		];

		for (const scene of this.scenes) {
			scene.init();
		}

		this.stage = new Scenes.Stage([
			this.scenes[0].scene,
			this.scenes[1].scene,
			this.scenes[2].scene,
		]);
		this.bot.use(session());
		this.bot.use(this.stage.middleware());

		this.bot.telegram
			.setMyCommands([
				{
					command: 'start',
					description: 'Bot starts',
				},
			])
			.then();
	}

	async launch(): Promise<void> {
		const db = await Db.getDb();
		this.channelService = new ChannelService(db);

		// fetch(`https://api.telegram.org/bot${this.configService.get('TOKEN')}/getUpdates`)
		// 	.then((res: any) => res.json())
		// 	.then((res) => {
		// 		if (res?.result?.length) {
		// 			console.log(res, 'res');
		// 			res.result.forEach(async (r: any) => {
		// 				for (const [key, value] of Object.entries(r)) {
		// 					if (key == 'my_chat_member') {
		// 						// @ts-ignore
		// 						const telegramId = value.chat.id;
		// 						// @ts-ignore
		// 						const channelName = value.chat.username;
		// 						// @ts-ignore
		// 						const channelTitle = value.chat.title || 'anon';
		//
		// 						await this.channelService.create(
		// 							telegramId.toString(),
		// 							channelTitle.toString(),
		// 							channelName.toString(),
		// 						);
		//
		// 						// @ts-ignore
		// 						if (value.new_chat_member.status == 'administrator') {
		// 							await this.channelService.setChannelAdmin(telegramId, true);
		// 						}
		// 						// @ts-ignore
		// 						if (value.new_chat_member.status == 'left') {
		// 							await this.channelService.setChannelAdmin(telegramId, false);
		// 						}
		// 					}
		// 				}
		// 			});
		// 		} else {
		// 			console.log('empty results');
		// 		}
		// 	});

		this.bot.use(checkRole(db, ['user', 'battler', 'admin', 'super-admin']));

		console.log('launch ');
		this.commands = [
			new StartCommand(this.bot, db),
			new AnyMessage(this.bot),
			new SetAdminCommand(this.bot),
			new SendBattlerPassword(this.bot),
			new SendAdminPassword(this.bot),
			new SetBattlerCommand(this.bot),
			new BackButtonCommand(this.bot),
			new EventTheBattleCommand(this.bot),
		];

		for (const command of this.commands) {
			command.init();
		}

		this.bot.launch();
		// this.bot.catch((err, ctx: IBotContext) => {
		// 	console.log(`Error for ${ctx.updateType} :`, err);
		// });
		// process.once('SIGINT', () => this.bot.stop('SIGINT'));
		// process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
	}
}

export const bot = new Bot(new ConfigService());
bot.launch().then();

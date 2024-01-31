import { BackButton, BattlesMenu, CreateBattleButton, UsersMenu } from '../utils/markup';
import { TGCommand } from './command.class';
import { Scenes } from 'telegraf';
import { Db } from '../database';
import { UserBattleService, UserService, BattleService } from '../services';
// import { GetBattles } from '../../common/sequelize/battle-model.sequelize';

export class EventTheBattleScene extends TGCommand {
	scene: any;
	backButton: any;
	battleButtons: any;
	createBattleButton: any;
	replyMarkup: any;
	userService: any;
	battleService: any;
	userBattleService: any;
	constructor(bot: any) {
		super(bot);
		this.scene = new Scenes.BaseScene('eventTheBattle');
	}

	init(): void {
		console.log(`scene 3 init`);

		const replyTextSample = (isName: string, isBattler1: string, isBattler2: string): string => {
			return `Create battle scene. Commands don't work!. 
			\nBattle settings: name(!)${isName} battler1${isBattler1} battler2${isBattler2}`;
		};

		this.scene.enter(async (ctx: any) => {
			console.log(`battle scene enter`);

			const db = await Db.getDb();
			this.userService = new UserService(db);
			const users = await this.userService.getUsers();

			this.battleButtons = await new UsersMenu(users).markup;
			this.createBattleButton = await new CreateBattleButton().markup;
			this.backButton = await new BackButton().markup;
			const session = ctx.scene.session;
			session.isname = `❌`;
			session.isbattler1 = `❌`;
			session.isbattler2 = `❌`;

			session.replyText = replyTextSample(session.isname, session.isbattler1, session.isbattler2);

			this.replyMarkup = {
				reply_markup: {
					inline_keyboard: [...this.battleButtons, this.createBattleButton, this.backButton],
				},
			};

			await ctx.replyWithHTML(session.replyText, this.replyMarkup);
		});

		this.scene.action(/battlerName-/, (ctx: any) => {
			const session = ctx.scene.session;
			try {
				const _value = ctx.match.input.replace('battlerName-', '');

				if (session.isbattler1 == `❌`) {
					session.isbattler1 = `✔️`;
					session.battler1 = _value;
				} else {
					session.isbattler2 = `✔️`;
					session.battler2 = _value;
				}
				session.replyText = replyTextSample(session.isname, session.isbattler1, session.isbattler2);
				ctx.replyWithHTML(session.replyText, this.replyMarkup);

				console.log('battler ' + session.battler1, session.battler2);
			} catch (e) {
				console.log(e);
			}
		});

		this.scene.on('message', async (ctx: any) => {
			const session = ctx.scene.session;
			session.battleName = ctx.message.text;
			session.isname = `✔️`;
			session.replyText = replyTextSample(session.isname, session.isbattler1, session.isbattler2);
			await ctx.replyWithHTML(session.replyText, this.replyMarkup);
			console.log(ctx.message.text, ctx.scene.session.battleName, 'set battle name');
		});

		this.scene.action('createBattle', async (ctx: any) => {
			const session = ctx.scene.session;
			const db = await Db.getDb();
			this.battleService = new BattleService(db);
			this.userBattleService = new UserBattleService(db);
			const _newBattle = await this.battleService.create(session.battleName);
			console.log('new battle ' + _newBattle);
			await this.userBattleService.create(session.battler1, _newBattle.id);
			await this.userBattleService.create(session.battler2, _newBattle.id);
		});
	}
}
export class EventTheBattleCommand extends TGCommand {
	scene: any;
	constructor(bot: any) {
		super(bot);
	}
	init(): void {
		try {
			this.bot.action('eventTheBattle', (ctx: any) => {
				ctx.scene.enter('eventTheBattle');
			});
		} catch (e) {
			console.log(e);
		}
	}
}

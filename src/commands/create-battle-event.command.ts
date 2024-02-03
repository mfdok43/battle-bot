import { BackButton, BattlesMenu, CreateBattleButton, UsersMenu } from '../utils/markup';
import { TGCommand } from './command.class';
import { Scenes } from 'telegraf';
import { Db } from '../database';
import { UserService, BattleService } from '../services';
// import { GetBattles } from '../../common/sequelize/battle-model.sequelize';

export class CreateBattleEventScene extends TGCommand {
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
		this.scene = new Scenes.BaseScene('createBattleEvent');
	}

	init(): void {
		console.log(`scene 3 init`);

		const replyTextSample = (isName: string, isBattler1: string, isBattler2: string): string => {
			return `Create battle scene. Commands don't work!
			\nBattle name(!): ${isName} \nBattler1: ${isBattler1} \nBattler2: ${isBattler2}`;
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

		this.scene.action(/battlerName-/, async (ctx: any) => {
			const session = ctx.scene.session;

			try {
				const _value = ctx.match.input.replace('battlerName-', '');
				const _battler = await this.userService.getById(_value);

				console.log('role 111', _battler.role);

				if (_battler.role == 'user') {
					await this.userService.updateRole(_value, 'battler');
					this.bot.telegram.sendMessage(_value, `Yeah! Your role updated to battler!`);
				}

				if (session.isbattler1 == `❌`) {
					session.isbattler1 = `${_battler.firstName} ${_battler.username || null} ✔️`;
					session.battlerId1 = _value;
				} else {
					session.isbattler2 = `${_battler.firstName} ${_battler.username || null} ✔️`;
					session.battlerId2 = _value;
				}
				session.replyText = replyTextSample(session.isname, session.isbattler1, session.isbattler2);
				await ctx.replyWithHTML(session.replyText, this.replyMarkup);

				// console.log('battler ', _battler.username);
			} catch (e) {
				console.log(e);
			}
		});

		this.scene.on('message', async (ctx: any) => {
			const session = ctx.scene.session;
			session.battleName = ctx.message.text;
			session.isname = `${session.battleName} ✔️`;
			session.replyText = replyTextSample(session.isname, session.isbattler1, session.isbattler2);
			await ctx.replyWithHTML(session.replyText, this.replyMarkup);
			console.log(ctx.message.text, ctx.scene.session.battleName, 'set battle name');
		});

		this.scene.action('createBattle', async (ctx: any) => {
			try {
				const session = ctx.scene.session;
				const db = await Db.getDb();
				this.battleService = new BattleService(db);
				const _newBattle = await this.battleService.create(
					session.battleName,
					session.battlerId1,
					session.battlerId2,
				);
				console.log('battle created ', _newBattle);
				ctx.scene.leave();
				this.bot.telegram.sendMessage(
					session.battlerId1,
					`Congratulations! Your battle "${session.battleName}" is planned!
					Make your skills stronger🎤`,
				);
				this.bot.telegram.sendMessage(
					session.battlerId2,
					`Congratulations! Your battle "${session.battleName}" is planned!
					Make your skills stronger🎤`,
				);
				await ctx.reply(`Battle created! You can event it later.`);
				await ctx.reply(`Main menu. Enter /start command.`);
			} catch (e) {
				console.log(e);
			}
		});
	}
}
export class CreateBattleEventCommand extends TGCommand {
	scene: any;
	constructor(bot: any) {
		super(bot);
	}
	init(): void {
		try {
			this.bot.action('createBattleEvent', (ctx: any) => {
				ctx.scene.enter('createBattleEvent');
			});
		} catch (e) {
			console.log(e);
		}
	}
}

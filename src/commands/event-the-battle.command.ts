import { TGCommand } from './command.class';
import { Scenes } from 'telegraf';
import { BackButton, BattlesMenu, PlannedBattlesMenu, ReadyToBattleButton } from '../utils/markup';
import { Battle } from '../database/models';
import { BattleService, UserService } from '../services';
import { Db } from '../database';

export class EventTheBattleScene extends TGCommand {
	scene: any;
	backButton: any;
	plannedBattlesMarkup: any;
	battleService: any;
	userService: any;
	_session: any;
	constructor(bot: any) {
		super(bot);
		this.scene = new Scenes.BaseScene('eventTheBattle');
	}

	init(): void {
		const replyTextSample = (name: string, playerOne: string, playerTwo: string): string => {
			return `Battle "${name}" is going! Players can send rounds🚀
			 \nPlayerOne🥷: ${playerOne} 
			 \nPlayerTwo🥷: ${playerTwo}`;
		};

		this.scene.enter(async (ctx: any) => {
			const session = ctx.scene.session;
			const db = await Db.getDb();
			this.battleService = new BattleService(db);
			this.userService = new UserService(db);
			const plannedBattles = await this.battleService.getPlannedBattles();
			this.plannedBattlesMarkup = new PlannedBattlesMenu(plannedBattles).markup;
			this.backButton = await new BackButton().markup;

			await ctx.replyWithHTML('Select the battle', {
				reply_markup: {
					inline_keyboard: [...this.plannedBattlesMarkup, this.backButton],
				},
			});
		});

		this.scene.action(/plannedBattle-/, async (ctx: any) => {
			this._session = ctx.scene.session;
			const session = ctx.scene.session;
			session.battleId = ctx.match.input.replace('plannedBattle-', '');
			await this.battleService.updateStatus(session.battleId, 'going');
			const battle = await this.battleService.getById(session.battleId);
			session.battleName = battle.name;
			session.playerOneId = battle.playerOne;
			session.playerTwoId = battle.playerTwo;
			session.playerOne = await this.userService.getById(session.playerOneId);
			session.playerTwo = await this.userService.getById(session.playerTwoId);
			session.playerOneRounds = ['❌', '❌', '❌'];
			session.playerTwoRounds = ['❌', '❌', '❌'];
			session.playerOneReady = false;
			session.playerTwoReady = false;

			session.playerDetails = (player: any, rounds: []): string => {
				let _str: string = `${player.firstName} ${player.username}`;
				rounds.forEach((round: any, index: number) => {
					if (index == 0) {
						_str += `\nRound 1️⃣ - ${round}`;
					}

					if (index == 1) {
						_str += `\nRound 2️⃣ - ${round}`;
					}

					if (index == 2) {
						_str += `\nRound 3️⃣ - ${round}`;
					}
				});
				return _str;
			};
			console.log('plannedBattle', session.playerOneId, session.playerTwoId);

			this.bot.telegram.sendMessage(
				session.playerOneId,
				`Battle ${session.battleName} has started! Are you ready?`,
				{
					reply_markup: {
						inline_keyboard: [await new ReadyToBattleButton(session.playerOneId).markup],
					},
				},
			);
			this.bot.telegram.sendMessage(
				session.playerTwoId,
				`Battle ${session.battleName} has started! Are you ready?`,
				{
					reply_markup: {
						inline_keyboard: [await new ReadyToBattleButton(session.playerTwoId).markup],
					},
				},
			);
			ctx.reply(
				replyTextSample(
					session.battleName,
					session.playerDetails(session.playerOne, session.playerOneRounds),
					session.playerDetails(session.playerTwo, session.playerTwoRounds),
				),
			);
		});

		this.bot.action(/playerReadyToBattle-/, async (ctx: any) => {

			const _playerId = ctx.match.input.replace('playerReadyToBattle-', '');
			if (this._session.playerOneId == _playerId) {
				this._session.playerOneReady = true;
				ctx.reply('Yeeeah! Waiting for opponent⏰');
				// this.bot.telegram.sendMessage(_playerId, 'Yeeeah! Waiting for opponent⏰');
			} else {
				this._session.playerTwoReady = true;
				ctx.reply('Yeeeah! Waiting for opponent⏰');
				// this.bot.telegram.sendMessage(_playerId, 'Yeeeah! Waiting for opponent⏰');
			}

			if (this._session.playerOneReady && this._session.playerTwoReady) {
				const random: string = Math.random() < 0.5 ? '0' : '1';
				if (random == '0') {
					this.bot.telegram.sendMessage(
						this._session.playerOneId,
						`${this._session.playerOne.firstName} ${this._session.playerOne.username} starts first.`,
					);
					this.bot.telegram.sendMessage(
						this._session.playerTwoId,
						`${this._session.playerOne.firstName} ${this._session.playerOne.username} starts first.`,
					);
					this.bot.telegram.sendMessage(
						this._session.playerOneId,
						`You have 10 minutes to send round🎤`,
					);
				} else {
					this.bot.telegram.sendMessage(
						this._session.playerOneId,
						`${this._session.playerTwo.firstName} ${this._session.playerTwo.username} starts first.`,
					);
					this.bot.telegram.sendMessage(
						this._session.playerTwoId,
						`${this._session.playerOne.firstName} ${this._session.playerOne.username} starts first.`,
					);
					this.bot.telegram.sendMessage(
						this._session.playerTwoId,
						`You have 10 minutes to send round🎤`,
					);
				}
			}

			console.log('ready', this._session.playerOneReady, this._session.playerTwoReady);
			// ctx.reply('rabotAe', _playerId);
			console.log('2id', this._session.playerOneId, this._session.playerTwoId);
		});

		this.scene.hears('/mainmenu', async (ctx: any) => {
			await this.battleService.updateStatus(ctx.scene.session.battleId, 'planned');
			ctx.scene.leave();
			ctx.reply(`Battle cancelled!`);
			ctx.reply(`Main menu. Enter /start command.`);
		});

		// this.bot.on('video_note', (ctx: any) => {
		// 	console.log('on', ctx.message);
		// 	ctx.reply(`context ${ctx.message}`);
		// });
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

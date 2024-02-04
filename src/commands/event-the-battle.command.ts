import { TGCommand } from './command.class';
import { Scenes } from 'telegraf';
import {
	BackButton,
	BattlesMenu,
	PlannedBattlesMenu,
	ReadyToBattleButton,
	VideoNoteButton,
} from '../utils/markup';
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
	_ctx: any;
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
			this._ctx = ctx;
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
				if (this._session.playerTwoReady === false) {
					ctx.reply('Yeeeah! Waiting for opponent⏰');

					this.bot.telegram.sendMessage(
						this._session.playerTwoId,
						`Your opponent is ready! Waiting for you⏰`,
					);
				}
			} else {
				this._session.playerTwoReady = true;
				if (this._session.playerOneReady === false) {
					ctx.reply('Yeeeah! Waiting for opponent⏰');

					this.bot.telegram.sendMessage(
						this._session.playerOneId,
						`Your opponent is ready! Waiting for you⏰`,
					);
				}
			}

			if (this._session.playerOneReady && this._session.playerTwoReady) {
				this._session.roundCounter = 1;
				const random: string = Math.random() < 0.5 ? '0' : '1';
				if (random == '0') {
					this._session.playerTurnsFirst = this._session.playerOneId;
					this._session.playerTurnsNow = this._session.playerOneId;
					this.bot.telegram.sendMessage(
						this._session.playerOneId,
						`Round 1️⃣, ${this._session.playerOne.firstName} ${this._session.playerOne.username} starts first.`,
					);
					this.bot.telegram.sendMessage(
						this._session.playerTwoId,
						`Round 1️⃣, ${this._session.playerOne.firstName} ${this._session.playerOne.username} starts first.`,
					);
					this.bot.telegram.sendMessage(
						this._session.playerOneId,
						`Battle is started🎬 You have 10 minutes to send round🎤`,
					);
				} else {
					this._session.playerTurnsFirst = this._session.playerTwoId;
					this._session.playerTurnsNow = this._session.playerTwoId;
					this.bot.telegram.sendMessage(
						this._session.playerOneId,
						`Round 1️⃣, ${this._session.playerTwo.firstName} ${this._session.playerTwo.username} starts first.`,
					);
					this.bot.telegram.sendMessage(
						this._session.playerTwoId,
						`Round 1️⃣, ${this._session.playerOne.firstName} ${this._session.playerOne.username} starts first.`,
					);
					this.bot.telegram.sendMessage(
						this._session.playerTwoId,
						`Battle is started. You have 10 minutes to send round🎤`,
					);
				}
			}
		});

		this.scene.hears('/mainmenu', async (ctx: any) => {
			await this.battleService.updateStatus(ctx.scene.session.battleId, 'planned');
			ctx.scene.leave();
			ctx.reply(`Battle cancelled!`);
			ctx.reply(`Main menu. Enter /start command.`);
		});

		this.bot.on('video_note', async (ctx: any) => {
			const rounds: string[] = ['1️⃣', '2️⃣', '3️⃣'];

			const _playerReplyText = (player: any, rounds: []): string => {
				let _str: string = `Player ${player.firstName} ${player.username} rounds: `;
				rounds.forEach((round: any) => (_str += round));
				return _str;
			};

			if (ctx.from.id == this._session.playerTurnsNow) {
				const _currentPlayer = await this.userService.getById(this._session.playerTurnsNow);
				const _currentPlayerName = `${_currentPlayer.firstName} ${_currentPlayer.username}`;
				const _currentPlayerUrl =
					_currentPlayer.instagram != null
						? _currentPlayer.instagram
						: 'https://www.instagram.com/kolobattle/';

				if (this._session.playerTurnsNow == this._session.playerOneId) {
					this._session.playerOneRounds[this._session.roundCounter - 1] = `✔️`;
					this._session.playerTurnsNow = this._session.playerTwoId;

					if (this._session.roundCounter != 4) {
						this.bot.telegram.sendMessage(this._session.playerTwoId, `Your turn! Send this shit🚀`);
					}
				} else {
					this._session.playerTwoRounds[this._session.roundCounter - 1] = `✔️`;
					this._session.playerTurnsNow = this._session.playerOneId;

					if (this._session.roundCounter != 4) {
						this.bot.telegram.sendMessage(this._session.playerOneId, `Your turn! Send this shit🚀`);
					}
				}

				this.bot.telegram.sendMessage(
					this._session.playerOneId,
					_playerReplyText(this._session.playerOne, this._session.playerOneRounds) +
						'\n' +
						_playerReplyText(this._session.playerTwo, this._session.playerTwoRounds),
				);
				this.bot.telegram.sendMessage(
					this._session.playerTwoId,
					_playerReplyText(this._session.playerOne, this._session.playerOneRounds) +
						'\n' +
						_playerReplyText(this._session.playerTwo, this._session.playerTwoRounds),
				);

				this.bot.telegram.sendVideoNote('-1001983838390', ctx.message.video_note.file_id, {
					reply_markup: {
						inline_keyboard: [
							await new VideoNoteButton(
								rounds[this._session.roundCounter - 1],
								_currentPlayerName,
								_currentPlayerUrl,
							).markup,
						],
					},
				});

				if (
					this._session.playerOneRounds[this._session.roundCounter - 1] == `✔️` &&
					this._session.playerTwoRounds[this._session.roundCounter - 1] == `✔️`
				) {
					this._session.roundCounter++;
				}

				if (this._session.roundCounter == 4) {
					this.scene.leave();

					const _admins = await this.userService.getAdmins();
					_admins.forEach((admin: any) => {
						this.bot.telegram.sendMessage(
							admin.login,
							`Battle completed! You can save results in admin panel🫵😎 \nMain menu. Enter /start command.`,
						);
					});

					this.bot.telegram.sendMessage(
						this._session.playerOneId,
						`Battle completed! Wait for results🫵😎 \nMain menu. Enter /start command.`,
					);
					this.bot.telegram.sendMessage(
						this._session.playerTwoId,
						`Battle completed! Wait for results🫵😎 \nMain menu. Enter /start command.`,
					);
				} else {
					if (this._session.playerTurnsNow == this._session.playerTwoId) {
						this.bot.telegram.sendMessage(
							this._session.playerOneId,
							`Wait for another player's turn⏰`,
						);
					} else {
						this.bot.telegram.sendMessage(
							this._session.playerTwoId,
							`Wait for another player's turn⏰`,
						);
					}
				}
				console.log(
					'video_note',
					ctx.from.id,
					this._session.playerTurnsNow,
					this._session.playerOneRounds,
					this._session.playerTwoRounds,
					'counter',
					this._session.roundCounter,
				);
			} else {
				ctx.reply(`Another player turns now⏰`);
				console.log(
					'video_note',
					ctx.from.id,
					this._session.playerTurnsNow,
					this._session.playerOneRounds,
					this._session.playerTwoRounds,
					'counter',
					this._session.roundCounter,
				);
			}
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

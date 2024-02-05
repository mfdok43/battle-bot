import { BattlesMenu, MainAdminMenu } from '../utils/markup';
import { TGCommand } from './command.class';
import { UserService, BattleService, LinkService } from '../services';
import { IDb } from '../database';

export class StartCommand extends TGCommand {
	private userService;
	private battleService;
	private linkService;
	menuButtons: any;
	battleButtons: any;

	constructor(bot: any, db: IDb) {
		super(bot);
		this.userService = new UserService(db);
		this.battleService = new BattleService(db);
		this.linkService = new LinkService(db);
		this.menuButtons = new MainAdminMenu().markup;
	}

	// private getUserName(user: { username?: string; firstName: string }): string {
	// 	return user.username ? `@${user.username}` : user.firstName;
	// }
	init(): void {
		this.bot.start(async (ctx: any) => {
			try {
				const login = String(ctx.chat.id);
				const username = ctx.chat.username;
				const firstName = ctx.chat.first_name;
				const lastName = ctx.chat.last_name;

				ctx.session.user = {
					...ctx.session.user,
					login,
					username,
					firstName,
					lastName,
				};

				console.log(login, username, firstName, lastName, ctx.session);

				const currentUser = await this.userService.getById(login);
				console.log('user' + currentUser + ctx.scene);

				//ctx.scene.leave()

				if (currentUser === null) {
					console.log('base empty');
					await this.userService.create(login, username, firstName, lastName);
					ctx.reply(
						`Hello, ${ctx.from.first_name} ${ctx.from.username}! Please enter /start command again🙂.`,
					);
				} else {
					if (ctx.session.role == 'user') {
						console.log('user is here', ctx.session.role);
						ctx.reply(`Hello, ${ctx.from.first_name} ${ctx.from.username}! you wanna battle?`);
					} else {
						if (ctx.session.role == 'battler') {
							console.log('battler is here', ctx.session.role);
							const currentBattles = await this.battleService.findAll();
							this.battleButtons = new BattlesMenu(currentBattles).markup;

							if (currentBattles) {
								ctx.reply(
									`Hello, ${ctx.from.first_name} ${ctx.from.username}! No planned battles now🙃`,
								);
							} else {
								ctx.reply(
									`Hello, ${ctx.from.first_name} ${ctx.from.username}! Click the battle if you ready🥷`,
									{
										reply_markup: {
											inline_keyboard: this.battleButtons,
										},
									},
								);
							}
						} else {
							// const _koloLink = this.linkService.create('https://www.instagram.com/kolobattle/');

							ctx.reply(
								`Hello, ${ctx.from.first_name} ${ctx.from.username}! You can make business🙂`,
								{
									reply_markup: {
										inline_keyboard: this.menuButtons,
									},
								},
							);
						}
					}
				}
			} catch (e) {
				console.log(e);
			}
		});
	}
}

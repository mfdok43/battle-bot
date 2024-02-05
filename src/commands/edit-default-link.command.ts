import {BackButton, UpdateLinkButton} from '../utils/markup';
import { TGCommand } from './command.class';
import { Scenes } from 'telegraf';
import { Db } from '../database';
import { LinkService } from '../services';

export class EditDefaultLinkScene extends TGCommand {
	scene: any;
	backButton: any;
	updateLinkButton: any;
	replyMarkup: any;
	linkService: any;
	constructor(bot: any) {
		super(bot);
		this.scene = new Scenes.BaseScene('editDefaultLink');
	}

	init(): void {
		console.log(`scene link edit init`);

		this.scene.enter(async (ctx: any) => {
			console.log(`battle scene enter`);

			const db = await Db.getDb();
			this.linkService = new LinkService(db);
			this.backButton = await new BackButton().markup;
			this.updateLinkButton = await new UpdateLinkButton().markup;
			this.replyMarkup = {
				reply_markup: {
					inline_keyboard: [this.backButton],
				},
			};
			await ctx.replyWithHTML(
				`Send new default link🔗\nLink must includes "https://"`,
				this.replyMarkup,
			);
		});

		this.scene.hears(
			/^(http|https|ftp):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)/i,
			async (ctx: any) => {
				const _markup = {
					reply_markup: {
						inline_keyboard: [this.updateLinkButton, this.backButton],
					},
				};

				const session = ctx.scene.session;
				session._link = ctx.message.text;
				await ctx.reply(`Your new link is "${session._link}"`, _markup);
			},
		);

		this.scene.action('updateLink', async (ctx: any) => {
			const session = ctx.scene.session;
			const _oldLink = await this.linkService.getById();
			console.log('link', session._link, _oldLink);
			await this.linkService.updateLink(_oldLink.linkId, session._link);
			await ctx.reply(`Link updated🫡\nMain menu. Enter /start command.`);
			ctx.scene.leave();
		});
	}
}
export class EditDefaultLinkCommand extends TGCommand {
	scene: any;
	constructor(bot: any) {
		super(bot);
	}
	init(): void {
		try {
			this.bot.action('editDefaultLink', (ctx: any) => {
				console.log('editDefaultLink', ctx.from);
				ctx.scene.enter('editDefaultLink');
			});
		} catch (e) {
			console.log(e);
		}
	}
}

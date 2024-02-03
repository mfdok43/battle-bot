import { TGCommand } from './command.class';

export class BackButtonCommand extends TGCommand {
	menuButtons: any;
	constructor(bot: any) {
		super(bot);
	}

	init(): void {
		try {
			this.bot.action('mainMenu', (ctx: any) => {
				console.log('leave');
				// ctx.deleteMessage(ctx.update.callback_query.message.message_id.toString());
				ctx.scene.leave();
				ctx.reply('Main menu. Enter /start command.');
			});
		} catch (e) {
			console.log(e);
		}
	}
}

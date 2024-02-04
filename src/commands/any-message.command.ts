import { TGCommand } from './command.class';
import { VideoNoteButton } from '../utils/markup';

export class AnyMessage extends TGCommand {
	markup: any;
	constructor(bot: any) {
		super(bot);
	}

	init(): void {
		console.log('init AnyMessage');
		try {
			// this.bot.on('message', (ctx: any) => {
			// 	if (
			// 		ctx.message.text.toLowerCase() == `привет` ||
			// 		ctx.message.text.toLowerCase() == 'привіт' ||
			// 		ctx.message.text.toLowerCase() == 'hello'
			// 	) {
			// 		ctx.reply(`Слава Україні🇺🇦`);
			// 	} else if (ctx.message.text.toLowerCase() == `хуй`) {
			// 		ctx.reply(`Розпуста`);
			// 	} else {
			// 		ctx.reply(`Ти написав ${ctx.message.text}`);
			// 	}
			// });
			this.bot.on('video_note', async (ctx: any) => {
				console.log('user id ' + ctx.from.first_name);
				// this.markup = await new VideoNoteButton('3️⃣', ctx.from.first_name, ctx.from.first_name)
				this.markup = [{ text: `Суддівський голос: АрХангел`, url: `https://www.instagram.com/kolobattle/` }];
				//demo channel
				// this.bot.telegram.sendVideoNote('-1001983838390', ctx.message.video_note.file_id, {
				// 	reply_markup: {
				// 		inline_keyboard: [this.markup],
				// 	},
				// });
				//KOLO channel
				this.bot.telegram.sendVideoNote('-1001636678990', ctx.message.video_note.file_id, {
					reply_markup: {
						inline_keyboard: [this.markup],
					},
				});
			});
		} catch (e) {
			console.log(e);
		}
	}
}

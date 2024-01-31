import { TGCommand } from './command.class';
import { FsOperations, SavePassword } from '../middleware';

export class SendBattlerPassword extends TGCommand {
	savePass: any;
	fs: any;
	constructor(bot: any) {
		super(bot);
		this.savePass = '';
		this.fs = new FsOperations();
	}
	init(): void {
		console.log('init SendBattlerPassword');

		try {
			this.bot.hears('/iamready', (ctx: any) => {
				this.savePass = new SavePassword().init();
				this.bot.telegram.sendMessage('363423028', `Hello, new pass is ${this.savePass}`);
				this.bot.telegram.sendMessage(ctx.chat.id, `Hello, new pass is *********`);
				this.fs.write('./src/middleware/fs-operations/battle-password.txt', this.savePass);
			});
		} catch (e) {
			console.log(e);
		}
	}
}

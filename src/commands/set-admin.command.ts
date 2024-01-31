import { TGCommand } from './command.class';
import { FsOperations } from '../middleware';
import { Db, IDb } from '../database';
import { UserService } from '../services';
import { Scenes } from 'telegraf';
import { BackButton } from '../utils/markup';

export class SetAdminScene extends TGCommand {
	scene: any;
	backButton: any;
	userService: any;
	fs: any;

	constructor(bot: any) {
		super(bot);
		this.fs = new FsOperations();
		this.scene = this.scene = new Scenes.BaseScene('setAdminScene');
	}

	init(): void {
		console.log('set admin scene init');
		this.scene.enter((ctx: any) => {
			this.backButton = new BackButton().markup;
			this.fs.watch(
				'./src/middleware/fs-operations/admin-password.txt',
				{ interval: 1000 },
				(curr: any, prev: any) => {
					const currentPassword = this.fs.read(
						'./src/middleware/fs-operations/admin-password.txt',
						'utf-8',
					);
					console.log(currentPassword, 'watch');
				},
			);

			const currPass = this.fs.read('./src/middleware/fs-operations/admin-password.txt', 'utf-8');

			ctx.reply('Enter the code', {
				reply_markup: {
					inline_keyboard: [this.backButton],
				},
			});

			this.scene.on('message', async (ctx: any) => {
				if (ctx.message.text === currPass) {
					const db = await Db.getDb();
					this.userService = new UserService(db);
					await this.userService.updateRole(ctx.chat.id, 'admin');
					ctx.reply('Congratulations! You became an admin😎', {
						reply_markup: {
							inline_keyboard: [this.backButton],
						},
					});
					this.fs.delete('./src/middleware/fs-operations/admin-password.txt');
				} else {
					ctx.reply('Try again🙂', {
						reply_markup: {
							inline_keyboard: [this.backButton],
						},
					});
				}
			});
		});
	}
}
export class SetAdminCommand extends TGCommand {
	scene: any;
	constructor(bot: any) {
		super(bot);
	}

	init(): void {
		console.log('init Set admin command');
		try {
			this.bot.hears('/setadmin', (ctx: any) => {
				console.log('setadmin enter');
				ctx.scene.enter('setAdminScene');
			});
		} catch (e) {
			console.log(e);
		}
	}
}

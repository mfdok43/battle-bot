import { UserService } from '../services';
import { IBattle, IUser } from '../context/context.interface';

export class MainMenu {
	markup: any;
	constructor() {
		this.markup = [
			[
				// { text: `Interval posts`, callback_data: 'intervalPosts' },
				{ text: 'New post', callback_data: 'createPost' },
			],
			[{ text: 'Event the battle', callback_data: 'eventTheBattle' }],
		];
	}
}

export class VideoNoteButton {
	markup: any;
	constructor(round: string, username: string, id: string) {
		this.markup = [{ text: `${round} Round: ${username}`, url: `t.me/${id}` }];
	}
}

export class CreateBattleButton {
	markup: any;
	constructor() {
		this.markup = [{ text: 'Create battle', callback_data: 'createBattle' }];
	}
}

export class BackButton {
	markup: any;
	constructor() {
		this.markup = [{ text: 'Main menu', callback_data: 'mainMenu' }];
	}
}

export class UsersMenu {
	markup: any;

	constructor(users: Array<IUser>) {
		console.log('users markup init ' + users);
		this.markup = users.map((u: any) => {
			return [{ text: u.firstName, callback_data: `battlerName-${u.login}` }];
		});
	}
}
export class BattlesMenu {
	markup: any;

	constructor(battles: Array<IBattle>) {
		console.log('battles markup init ' + battles);
		this.markup = battles.map((b: any) => {
			return [{ text: b.name, callback_data: b.id }];
		});
	}
}

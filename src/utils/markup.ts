import { UserService } from '../services';
import { IBattle, IUser } from '../context/context.interface';

export class MainAdminMenu {
	markup: any;
	constructor() {
		this.markup = [
			[{ text: `Event the battle (let's do it)!`, callback_data: 'eventTheBattle' }],
			[
				{ text: `Interval posts`, callback_data: 'intervalPosts' },
				{ text: 'New post', callback_data: 'createPost' },
			],
			[
				{ text: 'Create battle event', callback_data: 'createBattleEvent' },
				{ text: 'Send Video note', callback_data: 'sendVideoNote' },
			],
		];
	}
}

export class VideoNoteButton {
	markup: any;
	constructor(round: string, username: string, url: string) {
		this.markup = [{ text: `${round} Round: ${username}`, url: url }];
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

export class ReadyToBattleButton {
	markup: any;
	constructor(battlerId: string) {
		this.markup = [{ text: `I am ready🚀`, callback_data: `playerReadyToBattle-${battlerId}` }];
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
			return [{ text: b.name, callback_data: b.battleId }];
		});
	}
}

export class PlannedBattlesMenu {
	markup: any;
	constructor(battles: Array<IBattle>) {
		this.markup = battles.map((b: any) => {
			console.log('battles ' + b);
			return [{ text: b.name, callback_data: `plannedBattle-${b.battleId}` }];
		});
	}
}
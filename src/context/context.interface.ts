import { Context } from 'telegraf';
import { BattleStatus } from '../database/models/battle.model';

export interface IUser {
	login: string;
	username?: string;
	firstName: string;
	lastName?: string;
	role?: string;
	battles?: string;
}

export interface IBattle {
	battleId: string;
	name?: string | null;
	status: BattleStatus;
	playerOne: string;
	playerTwo: string;
	winner: string | null;
}

export interface IChannel {
	id: string;
	telegramId: string;
	channelTitle: string;
	channelName: string | null;
	isAdmin: boolean;
}

export interface SessionData {
	user: IUser;
	role: 'user' | 'battler' | 'admin' | 'super-admin';
}

export interface IBotContext extends Context {
	session: SessionData;
}

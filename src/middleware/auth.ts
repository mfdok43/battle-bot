import { IBotContext } from '../context';
import { IDb } from '../database';
import { UserService } from '../services';
import { User } from '@telegraf/types';

export const checkRole = (
	db: IDb,
	definedRoles: Array<'user' | 'battler' | 'admin' | 'super-admin'>,
) => {
	const userService = new UserService(db);

	return async (ctx: IBotContext, next: Function) => {
		const ctxUser: User | undefined = ctx.from;

		if (ctxUser) {
			const dbUser = await userService.getById(String(ctxUser?.id));

			if (!dbUser) {
				ctx.session.role = 'user';
				return next();
			} else {
				ctx.session.role = dbUser.role;
				return next();
			}
		}
	};
};

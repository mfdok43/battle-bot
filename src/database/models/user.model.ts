import {
	DataTypes,
	Model,
	NonAttribute,
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
} from '@sequelize/core';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { Unique, Attribute, PrimaryKey, Default, NotNull, HasMany } from '@sequelize/core/decorators-legacy';
import { Battle } from './battle.model';
import {sql} from "@sequelize/core";

export enum UserRole {
	User = 'user',
	Battler = 'battler',
	Admin = 'admin',
	SuperAdmin = 'super-admin',
}

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {

	@Attribute(DataTypes.BIGINT)
	@PrimaryKey
	@Unique
	@NotNull
	declare login: number;

	@Attribute(DataTypes.STRING)
	declare username?: string | null;

	@Attribute(DataTypes.STRING)
	@NotNull
	declare firstName: string;

	@Attribute(DataTypes.STRING)
	declare lastName?: string | null;

	@Attribute(DataTypes.STRING)
	@Default(UserRole.User)
	@NotNull
	declare role: UserRole;

	@Attribute(DataTypes.BOOLEAN)
	@Default(false)
	@NotNull
	declare readyToBattle: boolean | null;

	@Attribute(DataTypes.STRING)
	declare battles?: string | null;

	@Attribute(DataTypes.STRING)
	declare wins?: string | null;

	@Attribute(DataTypes.STRING)
	declare instagram?: string | null;

	// @HasMany(() => Battle, 'battleId')
	// declare battles?: NonAttribute<Battle[]> | null;
}

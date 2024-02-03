import {
	DataTypes,
	Model,
	NonAttribute,
	InferAttributes,
	InferCreationAttributes, sql,
} from '@sequelize/core';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import {Unique, Attribute, PrimaryKey, Default, NotNull, HasMany, HasOne} from '@sequelize/core/decorators-legacy';
import { User } from './user.model';

export enum BattleStatus {
	Planned = 'planned',
	Going = 'going',
	Completed = 'completed',
}
export class Battle extends Model<InferAttributes<Battle>, InferCreationAttributes<Battle>> {

	@Attribute(DataTypes.UUID)
	@PrimaryKey
	@Unique
	@NotNull
	declare battleId: string;

	@Attribute(DataTypes.STRING)
	declare name?: string | null;

	@Attribute(DataTypes.STRING)
	@Default(BattleStatus.Planned)
	@NotNull
	declare status: BattleStatus;

	@Attribute(DataTypes.STRING)
	@NotNull
	declare playerOne: string;

	@Attribute(DataTypes.STRING)
	@NotNull
	declare playerTwo: string;

	@Attribute(DataTypes.STRING)
	declare winner?: string | null;

	// @HasMany(() => User, 'login')
	// declare participants?: NonAttribute<User[]> | null;
	//
	// @HasOne(() => User, 'login')
	// declare winner: NonAttribute<User> | null;
}

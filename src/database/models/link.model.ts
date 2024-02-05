import {
	DataTypes,
	Model,
	NonAttribute,
	InferAttributes,
	InferCreationAttributes,
	sql,
} from '@sequelize/core';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { Unique, Attribute, PrimaryKey, Default, NotNull } from '@sequelize/core/decorators-legacy';

export class Link extends Model<InferAttributes<Link>, InferCreationAttributes<Link>> {
	@Attribute(DataTypes.UUID)
	@PrimaryKey
	@Unique
	@NotNull
	declare linkId: string;

	@Attribute(DataTypes.STRING)
	declare link?: string | null;
}

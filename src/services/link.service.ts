import { IDb } from '../database';
import { Link } from '../database/models';
import { SqlUuidV4 } from '@sequelize/core/types/expression-builders/uuid';
import { sql } from '@sequelize/core';

export class LinkService {
	private link: any;
	constructor(db: IDb) {
		this.link = Link;
	}

	async create(link: string): Promise<any> {
		const _linkId: SqlUuidV4 = sql.uuidV4;

		const linkData = {
			linkId: _linkId,
			link: link,
		};

		const [_link, created] = await this.link.findOrCreate({
			where: { linkId: _linkId },
			defaults: linkData,
		});

		console.log('battle created', _link);
		return _link;
	}

	async updateLink(id: string, link: string): Promise<any> {
		const [_link, created] = await this.link.update(
			{ link: link },
			{
				where: {
					linkId: id,
				},
			},
		);
		console.log('update link ' + link);
		return _link;
	}

	async getById(): Promise<any> {
		return await this.link.findOne({ where: { linkId: '26bd6564-a013-4d80-9036-65cd52552db7' } });
	}
}

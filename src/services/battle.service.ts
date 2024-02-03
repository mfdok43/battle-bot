import { IDb } from '../database';
import { Battle, BattleStatus } from '../database/models/battle.model';
import { sql } from '@sequelize/core';
import { SqlUuidV4 } from '@sequelize/core/types/expression-builders/uuid';
import { SavePassword } from '../middleware';
import { UserRole } from '../database/models/user.model';

export class BattleService {
	private battle: any;
	constructor(db: IDb) {
		this.battle = Battle;
	}

	async create(name: string, playerOne: string, playerTwo: string): Promise<any> {
		const _battleId: SqlUuidV4 = sql.uuidV4;

		const battleData = {
			battleId: _battleId,
			name: name,
			status: BattleStatus.Planned,
			playerOne: playerOne,
			playerTwo: playerTwo,
		};

		const [battle, created] = await this.battle.findOrCreate({
			where: { battleId: _battleId },
			defaults: battleData,
		});

		console.log('battle created', battle);
		return battle;
	}

	async findAll(): Promise<any> {
		const [battles] = await Promise.all([this.battle.findAll({ raw: true })]);
		return battles;
	}

	async getPlannedBattles(): Promise<any> {
		const [battles] = await Promise.all([
			this.battle.findAll({
				where: {
					status: 'planned',
				},
			}),
		]);
		return battles;
	}

	async getById(id: string): Promise<any> {
		return await this.battle.findOne({ where: { battleId: id } });
	}

	async updateStatus(id: string, status: string): Promise<any> {
		const battle = await this.battle.update(
			{ status: status },
			{
				where: {
					battleId: id.toString(),
				},
			},
		);
		console.log('update status ' + battle);
		return battle;
	}
}

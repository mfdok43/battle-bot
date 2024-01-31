export abstract class TGCommand {
	constructor(public bot: any) {}

	abstract init(): void;
}

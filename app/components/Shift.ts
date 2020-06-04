export interface IShift {
	isField: boolean;
	position: number;
	isOffering: boolean;
	shiftDate: Date;
	isOCP: boolean;
	tradePreference: number;
	shiftStart: Date;
	shiftEnd: Date;
	tradeDates?: string;
	notes?: string;
}

export default class Shift implements IShift {
	isField = true;
	position = 0;
	isOffering = true;
	shiftDate = new Date();
	isOCP = false;
	tradePreference = 0;
	shiftStart = new Date();
	shiftEnd = new Date();
	tradeDates = '';
	notes = '';

	constructor(shiftProps: IShift) {
		Object.assign(this, shiftProps);
	}
}

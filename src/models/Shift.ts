export interface IShift {
	isOffering?: boolean;
	isField?: boolean;
	position?: number;
	isOcp?: boolean;
	unitNumber?: number | undefined;
	shiftDate?: Date | string;
	shiftLetter?: string;
	timeFrame?: number;
	shiftStart?: Date;
	shiftEnd?: Date;
	tradePreference?: number;
	tradeDates?: string;
	notes?: string;
	id?: string;
	email?: string;
}

export interface ShiftLabelSet {
	isOffering?: string,
	isField?: string,
	position?: string,
	isOcp?: string,
	unitNumber?: string,
	shiftDate?: string,
	shiftLetter?: string,
	timeFrame?: string,
	tradePreference?: string,
	shiftStart?: string,
	shiftEnd?: string,
	tradeDates?: string,
	notes?: string,
	date?: string,
	time?: string,
	[key: string]: string | undefined;
}

export default class Shift implements IShift {
	isOffering = true;
	isField = true;
	position = 0;
	isOcp = false;
	unitNumber = undefined;
	shiftDate = new Date();
	shiftLetter = 'A';
	timeFrame = 12;
	shiftStart = new Date(new Date().setHours(10, 0, 0, 0));
	shiftEnd = new Date(new Date().setHours(22, 0, 0, 0));
	tradePreference = 0;
	tradeDates = '';
	notes = '';
	email = '';
	[key: string]: any;

	constructor(shiftProps?: IShift) {
		Object.assign(this, shiftProps);
		this.shiftDate = parseDateString(this.shiftDate);
		this.shiftStart = new Date(this.shiftStart);
		this.shiftEnd = new Date(this.shiftEnd);
	}
}

function parseDateString(dateString: Date | string | undefined) {
	if (dateString instanceof Date) {return dateString;}

	let parsed = new Date();
	if (dateString) {
		const dateParts = dateString.split('-').map((p: string) => parseInt(p));
		parsed.setFullYear(dateParts[0], dateParts[1] - 1, dateParts[2]);
	}

	return parsed;
}

// function randBool() {
// 	const num = Math.random();
// 	return num > 0.5
// }

// const randInt = (lessThan: number) => Math.floor(Math.random() * lessThan);
// const randMember = (ary: Array<any>) => ary[randInt(ary.length)];

// export function getDummyShift(filters: any = {}) {
// 	let isField = filters.isField && filters.isField.length ? randMember(filters.isField) : randBool();
// 	let position = filters.position && filters.position.length ? randMember(filters.position) : randInt(4);
// 	let isOffering = filters.isOffering && filters.isOffering.length ? randMember(filters.isOffering) : randBool();
// 	let isOcp = filters.isOcp && filters.isOcp.length ? randMember(filters.isOcp) : randBool();
// 	let tradePreference = filters.tradePreference &&filters.tradePreference.length ? randMember(filters.tradePreference) : (randInt(3) - 1);

// 	return new Shift({
// 		isField,
// 		position,
// 		isOffering,
// 		isOcp,
// 		tradePreference
// 	})
// }

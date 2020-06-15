export interface IShift {
	isOffering?: boolean;
	isField?: boolean;
	position?: number;
	isOcp?: boolean;
	shiftDate?: Date;
	shiftStart?: Date;
	shiftEnd?: Date;
	tradePreference?: number;
	tradeDates?: string;
	notes?: string;
	id?: string;
	email?: string;
}

export interface ShiftLabelSet {
	isField?: string,
	position?: string,
	isOffering?: string,
	shiftDate?: string,
	isOcp?: string,
	tradePreference?: string,
	shiftStart?: string,
	shiftEnd?: string,
	tradeDates?: string,
	notes?: string,
	dates?: string,
	[key: string]: string | undefined;
}

export interface ShiftFilterSet {
	isField: boolean[],
	position: number[],
	isOffering: boolean[],
	isOcp: boolean[],
	tradePreference: number[]
}

export default class Shift implements IShift {
	isOffering = true;
	isField = true;
	position = 0;
	isOcp = false;
	shiftDate = new Date();
	shiftStart = new Date();
	shiftEnd = new Date();
	tradePreference = 0;
	tradeDates = '';
	notes = '';
	email = '';
	[key: string]: any;

	constructor(shiftProps: IShift) {
		Object.assign(this, shiftProps);
	}
}

function randBool() {
	const num = Math.random();
	return num > 0.5
}

const randInt = (lessThan: number) => Math.floor(Math.random() * lessThan);
const randMember = (ary: Array<any>) => ary[randInt(ary.length)];

export function getDummyShift(filters: any = {}) {
	let isField = filters.isField && filters.isField.length ? randMember(filters.isField) : randBool();
	let position = filters.position && filters.position.length ? randMember(filters.position) : randInt(4);
	let isOffering = filters.isOffering && filters.isOffering.length ? randMember(filters.isOffering) : randBool();
	let isOcp = filters.isOcp && filters.isOcp.length ? randMember(filters.isOcp) : randBool();
	let tradePreference = filters.tradePreference &&filters.tradePreference.length ? randMember(filters.tradePreference) : (randInt(3) - 1);

	return new Shift({
		isField,
		position,
		isOffering,
		isOcp,
		tradePreference
	})
}

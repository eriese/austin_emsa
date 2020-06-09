export interface IShift {
	isField?: boolean;
	position?: number;
	isOffering?: boolean;
	shiftDate?: Date;
	isOCP?: boolean;
	tradePreference?: number;
	shiftStart?: Date;
	shiftEnd?: Date;
	tradeDates?: string;
	notes?: string;
	id?: string;
	email?: string;
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
	email = '';

	constructor(shiftProps: IShift) {
		Object.assign(this, shiftProps);
	}
}

function randBool() {
	const num = Math.random();
	return num > 0.5
}

const randInt = (lessThan) => Math.floor(Math.random() * lessThan);
const randMember = (ary) => ary[randInt(ary.length)];

export function getDummyShift(filters: any = {}) {
	let isField = filters.isField && filters.isField.length ? randMember(filters.isField) : randBool();
	let position = filters.position && filters.position.length ? randMember(filters.position) : randInt(4);
	let isOffering = filters.isOffering && filters.isOffering.length ? randMember(filters.isOffering) : randBool();
	let isOCP = filters.isOCP && filters.isOCP.length ? randMember(filters.isOCP) : randBool();
	let tradePreference = filters.tradePreference &&filters.tradePreference.length ? randMember(filters.tradePreference) : (randInt(3) - 1);

	return new Shift({
		isField,
		position,
		isOffering,
		isOCP,
		tradePreference
	})
}

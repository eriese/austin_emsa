export interface IShift {
	is_offering?: boolean;
	is_field?: boolean;
	position?: number;
	is_ocp?: boolean;
	unit_number?: number | undefined;
	shift_date?: Date | string;
	shift_letter?: string;
	timeframe?: number;
	shift_start?: Date;
	shift_end?: Date;
	trade_preference?: number;
	trade_dates?: string;
	notes?: string;
	id?: string;
	email?: string;
}

export interface ShiftLabelSet {
	is_offering?: string,
	is_field?: string,
	position?: string,
	is_ocp?: string,
	unit_number?: string,
	shift_date?: string,
	shift_letter?: string,
	timeframe?: string,
	trade_preference?: string,
	shift_start?: string,
	shift_end?: string,
	trade_dates?: string,
	notes?: string,
	date?: string,
	time?: string,
	[key: string]: string | undefined;
}

export default class Shift implements IShift {
	is_offering = true;
	is_field = true;
	position = 0;
	is_ocp = false;
	unit_number = undefined;
	shift_date = new Date();
	shift_letter = 'A';
	timeframe = 12;
	shift_start = new Date(new Date().setHours(10, 0, 0, 0));
	shift_end = new Date(new Date().setHours(22, 0, 0, 0));
	trade_preference = 0;
	trade_dates = '';
	notes = '';
	email = '';
	[key: string]: any;

	constructor(shiftProps?: IShift) {
		Object.assign(this, shiftProps);
		this.shift_date = parseDateString(this.shift_date);
		this.shift_start = new Date(this.shift_start);
		this.shift_end = new Date(this.shift_end);
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
// 	let trade_preference = filters.trade_preference &&filters.trade_preference.length ? randMember(filters.trade_preference) : (randInt(3) - 1);

// 	return new Shift({
// 		isField,
// 		position,
// 		isOffering,
// 		isOcp,
// 		trade_preference
// 	})
// }

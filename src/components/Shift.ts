export interface IShift {
	isOffering?: boolean;
	isField?: boolean;
	position?: number;
	isOcp?: boolean;
	shiftDate?: Date;
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
	shiftDate?: string,
	shiftLetter?: string,
	timeFrame?: string,
	tradePreference?: string,
	shiftStart?: string,
	shiftEnd?: string,
	tradeDates?: string,
	notes?: string,
	dates?: string,
	[key: string]: string | undefined;
}

function copyOrNew(ary: Array<any> | undefined) {
	return ary ? ary.slice() : [];
}

export class ShiftFilterSet {
	isOffering: boolean[] = [];
	isField: boolean[] = [];
	position: number[] = [];
	isOcp: boolean[] = [];
	shiftLetter: string[] = [];
	timeFrame: number[] = [];
	tradePreference: number[] = [];

	constructor(fromfilters?: ShiftFilterSet) {
		if (!fromfilters ) { return; }
		this.isField = copyOrNew(fromfilters.isField);
		this.position = copyOrNew(fromfilters.position);
		this.isOffering = copyOrNew(fromfilters.isOffering);
		this.isOcp = copyOrNew(fromfilters.isOcp);
		this.shiftLetter = copyOrNew(fromfilters.shiftLetter);
		this.timeFrame = copyOrNew(fromfilters.timeFrame);
		this.tradePreference = copyOrNew(fromfilters.tradePreference);
	}
}

export default class Shift implements IShift {
	isOffering = true;
	isField = true;
	position = 0;
	isOcp = false;
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

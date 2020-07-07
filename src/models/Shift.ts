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
	date?: string,
	time?: string,
	[key: string]: string | undefined;
}

function copyOrNew(ary: Array<any> | undefined, parser?: Function) {
	if (!ary) {return [];}
	if (typeof ary == 'string' && parser !== undefined) {
		return [parser(ary)];
	}
	if (ary.length === undefined || typeof ary == 'string') {
		return [ary]
	}

	return ary.slice();
}

function parseBool(str: string) {
	return str.toLowerCase() == 'true';
}

export class ShiftFilterSet {
	public static checkboxFields = ['isOffering', 'isField', 'position', 'isOcp', 'shiftLetter', 'timeFrame', 'tradePreference'];

	isOffering: boolean[] = [];
	isField: boolean[] = [];
	position: number[] = [];
	isOcp: boolean[] = [];
	shiftLetter: string[] = [];
	timeFrame: number[] = [];
	tradePreference: number[] = [];
	date: Date[] = [new Date()];
	dateType: string = 'After';
	[key: string]: Array<any> | string| Function

	constructor(fromfilters?: ShiftFilterSet | {[key: string]: any} ) {
		if (!fromfilters ) { return; }
		this.isField = copyOrNew(fromfilters.isField, parseBool);
		this.position = copyOrNew(fromfilters.position, parseInt);
		this.isOffering = copyOrNew(fromfilters.isOffering, parseBool);
		this.isOcp = copyOrNew(fromfilters.isOcp, parseBool);
		this.shiftLetter = copyOrNew(fromfilters.shiftLetter);
		this.timeFrame = copyOrNew(fromfilters.timeFrame, parseInt);
		this.tradePreference = copyOrNew(fromfilters.tradePreference, parseInt);
		this.dateType = fromfilters.dateType || 'After';

		if (JSON.stringify(fromfilters.date) != '[{}]') {
			this.date = copyOrNew(fromfilters.date || [new Date()], (d: string) => new Date(d));
		}
	}

	get sortedKeys() : string[] {
		return Object.keys(this).sort();
	}

	asQuery() {
		let queryDict : {[key: string]: string | string[] } = {};
		this.sortedKeys.forEach((k: string) => {
			if (k == 'date') {
				queryDict[k] = this[k].map((d : Date) => d.getTime().toString());
			} else if (k == 'dateType') {
				queryDict[k] = this[k];
			} else {
				const kArray = this[k];
				if (kArray instanceof Array && kArray.length > 0) {
					queryDict[k] = kArray.map((v : any) => v.toString());
				}
			}
		})

		return queryDict;
	}

	equals(otherFilterSet: ShiftFilterSet) {
		return JSON.stringify(this, this.sortedKeys) == JSON.stringify(otherFilterSet, this.sortedKeys);
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

	constructor(shiftProps?: IShift) {
		Object.assign(this, shiftProps);
		this.shiftDate = new Date(this.shiftDate);
		this.shiftStart = new Date(this.shiftStart);
		this.shiftEnd = new Date(this.shiftEnd);
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

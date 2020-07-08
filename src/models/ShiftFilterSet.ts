function copyOrNew(ary: Array<any> | undefined, parser: Function = (ary: any) => ary) {
	if (!ary) {return [];}
	if (!(ary instanceof Array)) {
		return [parser(ary)];
	}

	return ary.map((v) => parser(v));
}

function parseBool(str: string | boolean) {
	if (typeof str == 'boolean') {return str;}
	return str.toLowerCase() == 'true';
}

function parseDate(dateValue: any) {
	if (typeof dateValue == 'string' && !isNaN(parseInt(dateValue))) {
		dateValue = parseInt(dateValue);
	}

	const parsed = new Date(dateValue);
	if (!isNaN(parsed.getTime())) {
		return parsed;
	}

	return new Date();
}

export default class ShiftFilterSet {
	public static checkboxFields = ['isOffering', 'isField', 'position', 'isOcp', 'shiftLetter', 'timeFrame', 'tradePreference'];

	isOffering: boolean[];
	isField: boolean[];
	position: number[];
	isOcp: boolean[];
	shiftLetter: string[];
	timeFrame: number[];
	tradePreference: number[];
	date: Date[];
	dateType: string;
	[key: string]: Array<any> | string | Function

	constructor(fromfilters: ShiftFilterSet | {[key: string]: any} = {}) {
		this.isField = copyOrNew(fromfilters.isField, parseBool);
		this.position = copyOrNew(fromfilters.position, parseInt);
		this.isOffering = copyOrNew(fromfilters.isOffering, parseBool);
		this.isOcp = copyOrNew(fromfilters.isOcp, parseBool);
		this.shiftLetter = copyOrNew(fromfilters.shiftLetter);
		this.timeFrame = copyOrNew(fromfilters.timeFrame, parseInt);
		this.tradePreference = copyOrNew(fromfilters.tradePreference, parseInt);
		this.date = copyOrNew(fromfilters.date || [new Date()], parseDate);
		this.dateType = fromfilters.dateType || 'After';
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

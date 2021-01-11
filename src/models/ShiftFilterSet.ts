import ShiftViewModel from './ShiftViewModel';

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
	public static get checkboxFields() {
		const fieldConfigs = ShiftViewModel.fieldConfigs
		return ShiftViewModel.annotatedFields.filter((f) => fieldConfigs[f] && fieldConfigs[f].value_labels)
	}

	date: Date[];
	date_type: string;
	[key: string]: Array<any> | string | Function

	constructor(fromfilters: ShiftFilterSet | {[key: string]: any} = {}) {
		const fieldConfigs = ShiftViewModel.fieldConfigs;
		this.date_type = fromfilters.date_type || 'After';
		this.date = copyOrNew(fromfilters.date || [new Date()], parseDate);
		if (this.date_type != 'Before' && this.date[0] < new Date()) {
			this.date[0] = new Date();
		}

		ShiftFilterSet.checkboxFields.forEach((f) => {
			let parser;
			switch (fieldConfigs[f].field_type) {
				case "integer":
					parser = parseInt;
					break;
				case "boolean":
					parser = parseBool;
					break;
			}
			this[f] = copyOrNew(fromfilters[f], parser);
		})
	}

	get sortedKeys() : string[] {
		return Object.keys(this).sort();
	}

	asQuery() {
		let queryDict : {[key: string]: string | string[] } = {};
		this.sortedKeys.forEach((k: string) => {
			if (k == 'date') {
				queryDict[k] = this[k].map((d : Date) => d.getTime().toString());
			} else if (k == 'date_type') {
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

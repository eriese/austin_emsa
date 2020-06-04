import {PropertyConverter} from 'nativescript-ui-dataform';

export class BooleanValueConverter implements PropertyConverter {
	trueValue: string;
	falseValue: string;

	constructor(values : Array<string>) {
		this.trueValue = values[0];
		this.falseValue = values[1];
	}

	convertFrom(bool: boolean) {
		return bool ? this.trueValue : this.falseValue;
	}

	convertTo(str: string) {
		return str == this.trueValue;
	}
}

export class IndexValueConverter implements PropertyConverter {
	constructor(private values: Array<string>, private offset: number = 0) { }

	convertFrom(num: number) {
		return this.values[num - this.offset];
	}

	convertTo(str: string) {
		return this.values.indexOf(str) + this.offset;
	}
}

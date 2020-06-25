interface PropertyConverter<T> {
	convertFrom(val: T) : string | undefined;
	convertTo(str: string) : T | undefined;
}

export class BooleanValueConverter implements PropertyConverter<boolean> {
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

export class IndexValueConverter implements PropertyConverter<number> {
	constructor(private values: Array<string>, private offset: number = 0, private notFound?: string) { }

	convertFrom(num: number) {
		return num - this.offset < 0 ? this.notFound : this.values[num - this.offset];
	}

	convertTo(str: string) {
		return this.values.indexOf(str) + this.offset;
	}
}

export class IntegerValueConverter implements PropertyConverter<number> {
	constructor(private nanString: string) {}

	convertFrom(num: number) {
		return num < 0 ? this.nanString : num.toString();
	}

	convertTo(str: string) {
		const num = parseInt(str);
		return isNaN(num) ? -1 : num;
	}
}

export class SimpleConverter implements PropertyConverter<any> {
	convertFrom(str: any) {
		return str.toString();
	}

	convertTo(str: string) {
		return str;
	}
}

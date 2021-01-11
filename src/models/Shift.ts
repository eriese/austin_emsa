export interface IShift {
	is_offering: boolean;

	shift_date: Date | string;
	shift_start: Date;
	shift_end: Date;
	id?: string;
	email?: string;
}

export interface ShiftLabelSet {
	[key: string]: string | undefined;
}

export default class Shift implements IShift {
	shift_date = new Date();
	shift_start = new Date(new Date().setHours(10, 0, 0, 0));
	shift_end = new Date(new Date().setHours(22, 0, 0, 0));
	is_offering = true;
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

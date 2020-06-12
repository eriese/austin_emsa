import {BooleanValueConverter, IndexValueConverter} from './ValueConverters';
import Shift, {IShift} from './Shift';

export default class ShiftViewModel{
	readonly annotatedFields = [
		'isField',
		'position',
		'isOffering',
		'shiftDate',
		'isOcp',
		'tradePreference',
		'shiftStart',
		'shiftEnd',
		'tradeDates',
		'notes'
	]

	constructor(public shift: Shift) {}

	getFieldInputType(field: string) {
		switch (field) {
			case 'isField':
			case 'position':
			case 'isOffering':
			case 'isOcp':
			case 'tradePreference':
				return 'radio';
			case 'shiftDate':
				return 'date';
			case 'shiftStart':
			case 'shiftEnd':
				return 'time';
			case 'notes':
				return 'textarea';
			default:
				return 'text';
		}
	}

	getFieldLabel(field: string) {
		let label = '';
		switch (field) {
			case 'isField':
				label = 'Is this shift Comm or Field?';
				break;
			case 'position':
				label = "What's your position?";
				break;
			case 'isOffering':
				label = 'Are you offering a shift or picking up a shift?';
				break;
			case 'shiftDate':
				label = this.shift.isOffering ? 'What date is the shift you\'re offering?' : 'What date are you looking for a shift on?';
				break;
			case 'isOcp':
				label = 'What type of shift are you offering?';
				break;
			case 'tradePreference':
				label = 'Do you want a trade for this shift?';
				break;
			case 'shiftStart':
				label = 'When does the shift start?';
				break;
			case 'shiftEnd':
				label = 'When does the shift end?';
				break;
			case 'tradeDates':
				label = 'What dates would you be open to trading for?';
				break;
			case 'notes':
				label = 'Any notes about the shift?'
				break;
		}

		return label;
	}

	getFieldValueLabels(field: string, forList: boolean = false) {
		switch (field) {
			case 'isField':
				return ['Field', 'Comm'];
				break;
			case 'position':
				return ['Medic', 'CS', 'Captain', 'Commander'];
			case 'isOffering':
				return forList ? ['Offering', 'Seeking'] : ['Offering', 'Picking Up'];
			case 'isOcp':
				return ['OCP', 'Shift'];
			case 'tradePreference':
				return forList ? ['No Trade', 'Open to Trade', 'Trade Only'] : ['No Thanks', "I'm Open", 'Trade Required'];
		}
	}

	getFieldValueConverter(field: string, forList: boolean = false) {
		const fieldValues: string[] | undefined = this.getFieldValueLabels(field, forList);
		if (!fieldValues) { return; }
		switch (field) {
			case 'isField':
			case 'isOffering':
			case 'isOcp':
				return new BooleanValueConverter(fieldValues);
			case 'position':
				return new IndexValueConverter(fieldValues);
			case 'tradePreference':
				return new IndexValueConverter(fieldValues, -1);
		}
	}

	getFieldValueName(field: string, forList: boolean = false) {
		const fieldVal: any = this.shift[field];
		const converter = this.getFieldValueConverter(field, forList);
		return converter ? converter.convertFrom(fieldVal) : fieldVal;
	}

	getFieldFilterName(field: string) {
		switch (field) {
			case 'isOffering':
				return 'Post Type';
			case 'isField':
				return 'Comm or Field';
			case 'position':
				return 'Position';
			case 'isOcp':
				return 'Shift Type';
			case 'tradePreference':
				return 'Trade Preference';
			case 'tradeDates':
				return 'Trade Dates';
			case 'notes':
				return 'Notes';
		}

		return field;
	}
}

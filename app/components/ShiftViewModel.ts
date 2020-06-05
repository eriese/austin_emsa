import {BooleanValueConverter, IndexValueConverter} from './ValueConverters';
import Shift, {IShift} from './Shift';

export default class ShiftViewModel{
	readonly annotatedFields = [
		'isField',
		'position',
		'isOffering',
		'shiftDate',
		'isOCP',
		'tradePreference',
		'shiftStart',
		'shiftEnd',
		'notes'
	]

	constructor(public shift: Shift) {}

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
			case 'isOCP':
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

	getFieldValueLabels(field: string) {
		switch (field) {
			case 'isField':
				return ['Field', 'Comm'];
				break;
			case 'position':
				return ['Medic', 'CS', 'Captain', 'Commander'];
			case 'isOffering':
				return ['Offering', 'Picking Up'];
			case 'isOCP':
				return ['OCP', 'Shift'];
			case 'tradePreference':
				return ['No Thanks', "I'm Open", 'Trade Required'];
		}
	}

	getFieldValueConverter(field: string) {
		const fieldValues = this.getFieldValueLabels(field);
		switch (field) {
			case 'isField':
			case 'isOffering':
			case 'isOCP':
				return new BooleanValueConverter(fieldValues);
			case 'position':
				return new IndexValueConverter(fieldValues);
			case 'tradePreference':
				return new IndexValueConverter(fieldValues, -1);
		}
	}

	getFieldEditorType(field: string) {
		switch (field) {
			case 'isField':
			case 'position':
			case 'isOffering':
			case 'isOCP':
			case 'tradePreference':
				return 'SegmentedEditor';
			case 'shiftDate':
				return 'DatePicker';
			case 'shiftStart':
			case 'shiftEnd':
				return 'TimePicker';
			case 'notes':
				return 'MultilineText';
		}
	}

	getFieldValueName(field: string) {
		const fieldVal = this.shift[field];
		return this.getFieldValueConverter(field).convertFrom(fieldVal);
	}

	getFieldAnnotation(field: string) {
		return {
			entity: {
				name: field,
				displayName: this.getFieldLabel(field),
				valuesProvider: this.getFieldValueLabels(field),
				converter: this.getFieldValueConverter(field)
			},
			editor: this.getFieldEditorType(field)
		};
	}
}

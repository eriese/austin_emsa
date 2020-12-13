import {BooleanValueConverter, IndexValueConverter, IntegerValueConverter, SimpleConverter} from '../services/ValueConverters';
import Shift, {IShift} from './Shift';

let fieldConfig : {[key: string]: FieldConfig} = {};

export default class ShiftViewModel{
	static setFieldConfig(newConfig: {[key: string]: FieldConfig}) {
		fieldConfig = newConfig;
	}

	static get annotatedFields() {
		return Object.keys(fieldConfig);
	}

	constructor(public shift: Shift) {}

	getFieldInputType(field: string) : string {
		return fieldConfig[field].input_type || 'text';
	}

	getFieldLabelForContext(field: string, isInput: boolean) : string | undefined {
		const fieldData = fieldConfig[field];
		if (!fieldData) {return;}
		const conditions = isInput ? fieldData.alt_input_label_conditions : fieldData.alt_filter_label_conditions;
		let useAlt = false;
		if (conditions) {
			for (var i = 0; i < conditions.length; i++) {
				var cond = conditions[i];
				var condResult = this.testFieldCondition(cond);
				if (cond.logic == 'OR' || i == 0) {
					useAlt = useAlt || condResult;
				} else if (cond.logic == 'AND') {
					useAlt = useAlt && condResult;
				}
			}
		}

		if (useAlt) {
			return isInput ? fieldData.alt_input_label : fieldData.alt_filter_label;
		}
		return isInput ? fieldData.input_label : fieldData.filter_label;
	}

	getFieldLabel(field: string) : string | undefined {
		return this.getFieldLabelForContext(field, true);
	}

	getFieldFilterName(field: string) : string | undefined {
		return this.getFieldLabelForContext(field, false);
	}

	testFieldCondition(condition: LabelCondition) : boolean {
		if (condition.exists !== undefined) {
			const exists = this.shift != undefined;
			return exists === condition.exists;
		}

		if (condition.field) {
			const fieldVal = this.shift[condition.field];

			if (!condition.value.length) {
				return fieldVal == condition.value;
			}

			for (var i = 0; i < condition.value.length; i++) {
				if (condition.value[i] == fieldVal) {
					return true;
				}
			}
		}

		return false;
	}

	getFieldValueLabels(field: string, forList: boolean = false) : string[] | undefined {
		const fieldData = fieldConfig[field];
		if (!forList && fieldData.input_value_labels) {
			return fieldData.input_value_labels;
		}
		return fieldData.value_labels
	}

	getFieldValueConverter(field: string, forList: boolean = false) {
		const fieldValues: string[] | undefined = this.getFieldValueLabels(field, forList);
		if (!fieldValues) { return; }

		switch (fieldConfig[field].field_type) {
			case 'boolean':
				return new BooleanValueConverter(fieldValues);
			case 'integer':
				return new IndexValueConverter(fieldValues);
			default:
				return new SimpleConverter();
		}
	}

	getFieldValueName(field: string, forList: boolean = false) {
		const fieldVal: any = this.shift[field];
		const converter = this.getFieldValueConverter(field, forList);
		return converter ? converter.convertFrom(fieldVal) : fieldVal;
	}
}

interface LabelCondition {
	field?: string,
	value?: any,
	logic?: string,
	exists?: boolean
}

interface FieldConfig {
	internal_name: string,
	field_type: string,
	is_visible: boolean,
	filter_label?: string,
	alt_filter_label?: string,
	alt_filter_label_conditions?: LabelCondition[],
	input_label?: string,
	alt_input_label?: string,
	alt_input_label_conditions?: LabelCondition[],
	input_type: string,
	value_labels?: string[],
	input_value_labels?: string[],
	position: number
}

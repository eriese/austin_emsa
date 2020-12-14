import ShiftViewModel from '../models/ShiftViewModel';
import Shift, {ShiftLabelSet} from '../models/Shift';
import Vue from 'vue';

export default Vue.extend({
	data() {
		return {
			forList: true,
			displayFields: ShiftViewModel.annotatedFields.filter((f) => ShiftViewModel.fieldConfigs[f].display_in_list)
		}
	},
	computed: {
		dateFormatFilter() {
			return this.$options.filters && this.$options.filters.dateFormat;
		},
		dateString() : string {
			if (this.dateFormatFilter === undefined) { return ''; }

			const shiftDate = this.displayedShift.shift_date;
			const isThisYear = shiftDate.getFullYear() == new Date().getFullYear();
			const formatString = isThisYear ? 'dddd, M/DD' : 'dddd, M/DD/YY';
			return this.dateFormatFilter(shiftDate, formatString);
		},
		timeString() : string {
			if (this.dateFormatFilter === undefined) { return ''; }

			const startString = this.dateFormatFilter(new Date(this.displayedShift.shift_start), 'h:mm a');
			const endString = this.dateFormatFilter(new Date(this.displayedShift.shift_end), 'h:mm a');
			return `${startString}-${endString}` ;
		},
		valueLabels() : ShiftLabelSet {
			let labels: ShiftLabelSet = {
				date: this.dateString,
				time: this.timeString,
				dateTime: `${this.dateString} ${this.timeString}`
			}

			const vm = this;

			(<string[]>vm.displayFields).forEach((f: string) => {
				labels[f] = (<ShiftViewModel> vm.viewModel).getFieldValueName(f, <boolean> vm.forList);
			});

			return labels;
		},
		givenShift() {
			if (process.env.NODE_ENV != 'production') {
				console.warn(this.$options.name, 'does not override givenShift, which means that it cannot display shift information')
			}
			return undefined;
		},
		displayedShift(): Shift {
			return new Shift(this.givenShift);
		},
		viewModel() : ShiftViewModel {
			return new ShiftViewModel(this.displayedShift);
		}
	},
});

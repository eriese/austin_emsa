import ShiftViewModel from '../models/ShiftViewModel';
import Shift, {ShiftLabelSet} from '../models/Shift';
import Vue from 'vue';

export default Vue.extend({
	data() {
		return {
			forList: true,
			displayFields: [
				'isOffering',
				'position',
				'isOcp',
				'isOffering',
				'isField',
				'tradePreference',
				'shiftLetter',
				'timeFrame',
			]
		}
	},
	computed: {
		dateFormatFilter() {
			return this.$options.filters && this.$options.filters.dateFormat;
		},
		dateString() : string {
			if (this.dateFormatFilter === undefined) { return ''; }

			const shiftDate = new Date(this.displayedShift.shiftDate);
			const isThisYear = shiftDate.getFullYear() == new Date().getFullYear();
			const formatString = isThisYear ? 'dddd, M/DD' : 'dddd, M/DD/YY';
			return this.dateFormatFilter(shiftDate, formatString);
		},
		timeString() : string {
			if (this.dateFormatFilter === undefined) { return ''; }

			const startString = this.dateFormatFilter(new Date(this.displayedShift.shiftStart), 'h:mm a');
			const endString = this.dateFormatFilter(new Date(this.displayedShift.shiftEnd), 'h:mm a');
			return `${startString}-${endString}` ;
		},
		valueLabels() : ShiftLabelSet {
			let labels: ShiftLabelSet = {
				date: this.dateString,
				time: this.timeString
			}

			const vm = this;

			(<string[]>vm.displayFields).forEach((f: string) => {
				labels[f] = (<ShiftViewModel> vm.viewModel).getFieldValueName(f, <boolean> vm.forList);
			});

			return labels;
		},
		displayedShift(): Shift {
			if (process.env.NODE_ENV != 'production') {
				console.warn(this.$options.name, 'does not override displayedShift, which means that it cannot display shift information')
			}

			return new Shift();
		},
		viewModel() : ShiftViewModel {
			return new ShiftViewModel(this.displayedShift);
		}
	},
});
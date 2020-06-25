import ShiftViewModel from '../components/ShiftViewModel';
import Shift, {ShiftLabelSet} from '../components/Shift';
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
		dateString() : string {
			const dateFormat: Function | undefined = this.$options.filters && this.$options.filters.dateFormat;

			if (dateFormat === undefined) { return ''; }

			const shiftDate = new Date(this.displayedShift.shiftDate);
			const isThisYear = shiftDate.getFullYear() == new Date().getFullYear();
			const formatString = isThisYear ? 'dddd, M/DD' : 'dddd, M/DD/YY';
			const dayString = dateFormat(shiftDate, formatString);
			const startString = dateFormat(new Date(this.displayedShift.shiftStart), 'h:mm a');
			const endString = dateFormat(new Date(this.displayedShift.shiftEnd), 'h:mm a');
			return `${dayString} ${startString}-${endString}` ;
		},
		valueLabels() : ShiftLabelSet {
			let labels: ShiftLabelSet = {
				dates: this.dateString
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

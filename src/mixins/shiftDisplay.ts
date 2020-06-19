import ShiftViewModel from '../components/ShiftViewModel';
import Shift, {ShiftLabelSet} from '../components/Shift';
import Vue from 'vue';

export default Vue.extend({
	props: {
		shift: Object
	},
	data() {
		return {
			forList: true,
			viewModel: new ShiftViewModel(this.shift),
			displayFields: [
				'isOffering',
				'position',
				'isOcp',
				'isOffering',
				'isField',
				'tradePreference',
			]
		}
	},
	computed: {
		dateString() : string {
			const dateFormat: Function | undefined = this.$options.filters && this.$options.filters.dateFormat;

			if (dateFormat === undefined) { return ''; }

			const shiftDate = new Date(this.shift.shiftDate);
			const isThisYear = shiftDate.getYear() == new Date().getYear();
			const formatString = isThisYear ? 'dddd, MM/DD' : 'dddd, MM/DD/YY';
			const dayString = dateFormat(shiftDate, formatString);
			const startString = dateFormat(new Date(this.shift.shiftStart), 'h:mm a');
			const endString = dateFormat(new Date(this.shift.shiftEnd), 'h:mm a');
			return `${dayString} ${startString}-${endString}` ;
		},
		valueLabels() {
			let labels: ShiftLabelSet = {
				dates: this.dateString
			}

			const vm = this;

			(<string[]>vm.displayFields).forEach((f: string) => {
				labels[f] = (<ShiftViewModel> vm.viewModel).getFieldValueName(f, <boolean> vm.forList);
			});

			return labels;
		},
	}
});

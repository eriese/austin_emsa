import ShiftViewModel from '../components/ShiftViewModel';
import Shift, {ShiftLabelSet} from '../components/Shift';
import Vue from 'vue';

export default Vue.extend({
	props: {
		shift: Shift
	},
	data() {
		return {
			forList: true,
			viewModel: new ShiftViewModel(this.shift),
			displayFields: [
				'isOffering',
				'position',
				'isOCP',
				'isOffering',
				'isField',
				'tradePreference',
			]
		}
	},
	computed: {
		dateString() : string {
			const dateFormat: Function | undefined = this.$options.filters && this.$options.filters.dateFormat;

			return dateFormat !== undefined ? `${dateFormat(this.shift.shiftDate, "MM/DD/YY")} ${dateFormat(this.shift.shiftStart, 'h:mm a')}-${dateFormat(this.shift.shiftEnd, 'h:mm a')}` : '';
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

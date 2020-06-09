import ShiftViewModel from '../components/ShiftViewModel';

export default {
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
				'isOCP',
				'isOffering',
				'isField',
				'tradePreference',
			]
		}
	},
	computed: {
		dateString() {
			const dateFormat = this.$options.filters.dateFormat;

			return `${dateFormat(this.shift.shiftDate, "MM/DD/YY")} ${dateFormat(this.shift.shiftStart, 'h:mm a')}-${dateFormat(this.shift.shiftEnd, 'h:mm a')}`;
		},
		valueLabels() {
			let labels = {
				dates: this.dateString
			}

			this.displayFields.forEach((f) => {
				labels[f] = this.viewModel.getFieldValueName(f, this.forList);
			});

			return labels;
		},
	}
}

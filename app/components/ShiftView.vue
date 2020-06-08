<template>
	<ScrollView>
		<StackLayout>
			<Button text="Back" android.systemIcon="ic_menu_back" @tap="goBack"></Button>
			<Label :text="`${this.valueLabels.isOffering} Shift`" class="h1 text-center"/>
			<Label :text="this.valueLabels.dates" class="h2 text-center"/>
			<GridLayout columns="*,auto" :rows="rowSpec">
				<Label v-for="(field, $index) in listedFields" :text="fieldLabels[field]" :row="$index" col="0" />
				<Label v-for="(field, $index) in listedFields" :text="valueLabels[field]" :row="$index" col="1"/>
			</GridLayout>
		</StackLayout>
	</ScrollView>
</template>

<script>
import shiftDisplay from '../mixins/shiftDisplay';
import Shift from './Shift';

const excludedFields = 'id|shiftDate|shiftStart|shiftEnd'
const displayFields = Object.getOwnPropertyNames(new Shift()).filter((p) => p != 'id' && p != 'shiftDate');

export default {
	mixins: [shiftDisplay],
	data() {
		const listedFields = displayFields.filter((f) => f != 'isOffering');

		let rowSpec = [];
		for (var i = 0; i < listedFields.length; i++) {
			rowSpec.push('auto');
		}
		return {
			displayFields,
			listedFields,
			rowSpec: rowSpec.join(','),
		}
	},
	computed: {
		fieldLabels() {
			let labels = {};
			this.displayFields.forEach((f) => {
				labels[f] = this.viewModel.getFieldFilterName(f);
			})

			return labels;
		}
	},
	methods: {
		goBack() {
			this.$emit('back');
		}
	},
	mounted() {
		console.log('here', this.shift);
	}
}
</script>

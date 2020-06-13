<template native>
	<ScrollView>
		<StackLayout>
			<BackButtonListener @backPressed="goBack" />
			<Button text="Back" @tap="goBack" class="cta--is-round pull-left"></Button>
			<Label :text="`${this.valueLabels.isOffering} Shift`" class="h1 text-center"/>
			<Label :text="this.valueLabels.dates" class="h2 text-center"/>
			<GridLayout columns="*,auto" :rows="rowSpec" class="shift-view">
				<Label v-for="(field, $index) in listedFields" :text="fieldLabels[field]" :row="$index" col="0" :key="`field_${field}`" class="shift-view__label"/>
				<Label v-for="(field, $index) in listedFields" :text="valueLabels[field]" :row="$index" col="1" :key="`value_${field}`" class="shift-view__value"/>
			</GridLayout>
			<Button text="Email this poster" @tap="openEmail" class="cta" horizontalAlignment="center"/>
		</StackLayout>
	</ScrollView>
</template>

<script>
import shiftDisplay from '../mixins/shiftDisplay';
import Shift from '../components/Shift';
import {openUrl} from 'tns-core-modules/utils/utils';
import emsaPage from '../mixins/emsaPage';

const excludedFields = /(id|shiftDate|shiftStart|shiftEnd|email)/
const displayFields = Object.getOwnPropertyNames(new Shift()).filter((p) => !p.match(excludedFields));

export default {
	mixins: [shiftDisplay, emsaPage],
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
		},
		openEmail() {
			openUrl(`mailto:${this.shift.email}`);
		}
	}
}
</script>

<style scoped lang="scss">
.shift-view {
	padding: 20;

	&__label, &__value {
		font-size: 16;
		border-bottom-width: 1;
		border-bottom-color: var(--highlight);
		margin-bottom: 15;
	}

	&__value {
		color: var(--highlight);
	}
}
</style>

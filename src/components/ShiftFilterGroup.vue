<template>
	<StackLayout class="filter-group">
		<Label :text="label" class="filter-group__group-label"/>
		<WrapLayout class="filter-group__items">
			<CheckboxField v-for="(box, $index) in boxes" :key="$index" :checked="checks[$index]" @checkedChange="updateValue($event, $index)" :text="box"/>
		</WrapLayout>
	</StackLayout>
</template>
<template web>
	<fieldset class="filter-group">
		<legend class="filter-group__group-label">{{label}}</legend>
		<div class="filter-group__items">
			<span v-for="(box, $index) in boxes" :key="box">
				<input :id="`${filterKey}-${box}`" type="checkbox" :checked="checks[$index]" @change="updateValue($event, $index)">
				<label :for="`${filterKey}-${box}`">{{box}}</label>
			</span>
		</div>
	</fieldset>
</template>

<script>
	import ShiftViewModel from '../models/ShiftViewModel';

	export default {
		props: {
			value: Array,
			filterKey: String,
		},
		data() {
			const viewModel = new ShiftViewModel(null);
			return {
				viewModel,
				converter: viewModel.getFieldValueConverter(this.filterKey, true),
				label: viewModel.getFieldFilterName(this.filterKey),
				boxes: viewModel.getFieldValueLabels(this.filterKey, true)
			};
		},
		computed: {
			checks() {
				return this.boxes.map((b) => {
					const val = this.converter ? this.converter.convertTo(b) : b;
					return this.value.indexOf(val) >= 0
				});
			},
		},
		methods: {
			updateValue($event, $index) {
				const modelCopy = this.value.slice()
				const newVal = $event.target ? $event.target.checked : $event.value;
				if (newVal == this.checks[$index]) { return; }

				const valEquiv = this.converter.convertTo(this.boxes[$index]);

				const currentIndex = this.value.indexOf(valEquiv)
				if (newVal && currentIndex < 0) {
					modelCopy.push(valEquiv);
				} else if (!newVal && currentIndex >= 0) {
					modelCopy.splice(currentIndex, 1);
				}

				this.$emit('input', modelCopy.sort());
			}
		}
	}
</script>

<style lang="scss">
.filter-group {
	margin: 0.5rem 0.75rem;
	margin: 3 10;
	font-size: 1rem;
	font-size: 16;

	&__group-label {
		margin-bottom: 0.25rem;
		margin-bottom: -3;
		font-size: 1.25rem;
		font-size: 20;
	}
}
</style>

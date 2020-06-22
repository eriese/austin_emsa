<template>
	<StackLayout class="filter-group">
		<Label :text="label" class="filter-group__group-label"/>
		<WrapLayout class="filter-group__items">
			<CheckboxField v-for="(box, $index) in boxes" :key="$index" :checked="checks[$index]" @checkedChange="updateValue($event, $index)" :text="box"/>
		</WrapLayout>
	</StackLayout>
</template>
<template web>
	<h1>Group</h1>
</template>

<script>
	import ShiftViewModel from './ShiftViewModel';

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
				const newVal = $event.value;
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
	margin: 3 10;
	font-size: 16;

	&__group-label {
		margin-bottom: -3;
		font-size: 20;
	}
}
</style>

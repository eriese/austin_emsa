<template>
	<StackLayout class="filter-group">
		<Label :text="label" class="filter-group__group-label"/>
		<WrapLayout class="filter-group__items">
			<StackLayout orientation="horizontal" v-for="(box, $index) in boxes" :key="$index">
				<check-box class="filter-group__item-checkbox" :checked="checks[$index]" @checkedChange="updateValue($event, $index)" fillColor="#0e4c97"/>
				<Label :text="box" class="filter-group__item-label" verticalAlignment="center"/>
			</StackLayout>
		</WrapLayout>
	</StackLayout>
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
				return this.boxes.map((b) => this.value.indexOf(this.converter.convertTo(b)) >= 0);
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

				this.$emit('input', modelCopy);
			}
		}
	}
</script>

<style lang="scss">
.filter-group {
	margin: 3 10;

	&__group-label {
		margin-bottom: -3;
		font-size: 20;
	}

	&__item-label {
		font-size: 16;
	}
}
</style>

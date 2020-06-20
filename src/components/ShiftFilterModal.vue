<template native>
	<ModalStack dismissEnabled="true">
		<GridLayout width="90%" height="75%" columns="*, auto" rows="auto, *, auto, auto" class="ns-modal emsa-page filter-form">
			<Label text="Filter Shift Results" class="filter-form__header text-center" col="0" row="0"/>
			<Button :text="'\uf00d'" @tap="$modal.close(null)" class="fas pull-right ns-modal__close-button cta--is-round" col="1" row="0"/>
			<ScrollView col="0" row="1" colSpan="2">
				<StackLayout>
					<Label text="Dates" class="filter-group__group-label"/>
					<PickerField :items="dateTypes"  @pickerClosed="onDateTypeChange" :selectedValue="filterModel.dateType" />
					<DatePickerField :date="filterModel.date[0]" dateFormat="EEEE M/d/yy" @dateChange="onDateChanged($event, 0)" :minDate="today"/>
					<DatePickerField v-if="filterModel.dateType == 'Between'" :date="filterModel.date[1]" dateFormat="EEEE M/d/yy" @dateChange="onDateChanged($event, 1)" :minDate="filterModel.date[0]" />
					<ShiftFilterGroup v-for="filterKey in filterModel.checkboxFields" :key="filterKey" v-model="filterModel[filterKey]" :filter-key="filterKey"></ShiftFilterGroup>
				</StackLayout>
			</ScrollView>
			<Button text="Done" @tap="$modal.close(filterModel)" col="0" row="2" colSpan="2"/>
		</GridLayout>

	</ModalStack>
</template>

<script>
	import formComponent from '../mixins/formComponent';
	import ShiftFilterGroup from './ShiftFilterGroup';
	import {ShiftFilterSet} from './Shift';
	import ShiftViewModel from './ShiftViewModel';

	export default {
		mixins: [formComponent],
		components: {
			ShiftFilterGroup
		},
		props: {
			filters: Object
		},
		data() {
			const viewModel = new ShiftViewModel();
			return {
				filterModel: new ShiftFilterSet(this.filters),
				viewModel,
				dateTypes: ['On', 'Before', 'After', 'Between'],
				today: new Date()
			}
		},
		methods: {
			onDateTypeChange(args) {
				this.filterModel.dateType = args.object.selectedValue;
				if (this.filterModel.dateType == 'Between') {
					const minDate = this.filterModel.date[0];
					this.filterModel.date = [minDate, minDate];
				} else {
					this.filterModel.date = this.filterModel.date.slice(0,1);
				}
			},
			onDateChanged($event, index) {
				this.filterModel.date[index] = $event.value;
			}
		}
	}
</script>

<style lang="scss">
.filter-form {
	&__header {
		font-size: 24;
	}
}
</style>

<template native>
	<ModalContainer>
		<GridLayout width="90%" height="75%" columns="*, auto" rows="auto, *, auto, auto" class="ns-modal filter-form">
			<Label text="Filter Shift Results" class="filter-form__header text-center" col="0" row="0"/>
			<Button :text="'\uf00d'" @tap="$modal.close(null)" class="fas pull-right ns-modal__close-button button cta--is-round" col="1" row="0"/>
			<ScrollView col="0" row="1" colSpan="2">
				<StackLayout>
					<StackLayout class="filter-group">
						<Label text="Dates" class="filter-group__group-label"/>
						<PickerField :items="dateTypes"  @pickerClosed="onDateTypeChange" :selectedValue="filterModel.dateType" />
						<date-input v-model="filterModel.date[0]"  :bind="{minDate: today}" type="date"/>
						<date-input v-if="filterModel.dateType == 'Between'" v-model="filterModel.date[1]" :bind="{minDate: filterModel.date[0]}"  type="date"/>
					</StackLayout>
					<ShiftFilterGroup v-for="filterKey in checkboxFields" :key="filterKey" v-model="filterModel[filterKey]" :filter-key="filterKey"></ShiftFilterGroup>
				</StackLayout>
			</ScrollView>
			<Button text="Done" @tap="$modal.close(filterModel)" col="0" row="2" colSpan="2" class="button"/>
		</GridLayout>

	</ModalContainer>
</template>
<template web>
	<modal-container class="filter-form">
		<div>
			<button @click="$close(null)" class="button ns-modal__close-button cta--is-round cta--is-close fas fa-times" aria-label="close"></button>
			<h1 class="filter-form__header">Filter Shift Results</h1>
			<fieldset class="filter-group">
				<label class="filter-group__group-label">Dates</label>
				<div>
					<select name="dateType" id="date-type" v-model="filterModel.dateType" @change="onDateTypeChange" aria-label="Date filter type">
						<option v-for="dt in dateTypes" :value="dt">{{dt}}</option>
					</select>
					<date-input v-model="filterModel.date[0]"  :bind="{minDate: today}" type="date"/>
					<date-input v-if="filterModel.dateType == 'Between'" v-model="filterModel.date[1]" :bind="{minDate: filterModel.date[0]}" type="date" />
				</div>
			</fieldset>
			<shift-filter-group v-for="filterKey in checkboxFields" :key="filterKey" v-model="filterModel[filterKey]" :filter-key="filterKey"></shift-filter-group>
			<div class="text-center">
				<button @click="$close(filterModel)" class="button">Done</button>
			</div>
		</div>
	</modal-container>
</template>

<script>
	import ShiftFilterGroup from './ShiftFilterGroup';
	import {ShiftFilterSet} from '../models/Shift';
	import ShiftViewModel from '../models/ShiftViewModel';

	export default {
		components: {
			ShiftFilterGroup
		},
		props: {
			filters: Object,
		},
		data() {
			const viewModel = new ShiftViewModel();
			return {
				filterModel: new ShiftFilterSet(this.filters),
				checkboxFields: ShiftFilterSet.checkboxFields,
				viewModel,
				dateTypes: ['On', 'Before', 'After', 'Between'],
				today: new Date()
			}
		},
		methods: {
			onDateTypeChange(args) {
				this.filterModel.dateType = args.object ? args.object.selectedValue : args.target.value;
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
		font-size: 1.5rem;
		font-size: 24;
		text-align: center;
		clear: both;
	}
}
</style>

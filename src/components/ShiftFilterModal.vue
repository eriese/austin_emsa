<template native>
	<ModalStack dismissEnabled="true">
		<GridLayout width="90%" height="75%" columns="*, auto" rows="auto, *, auto, auto" class="ns-modal emsa-page filter-form">
			<Label text="Filter Shift Results" class="filter-form__header text-center" col="0" row="0"/>
			<Button :text="'\uf00d'" @tap="$modal.close(null)" class="fas pull-right ns-modal__close-button cta--is-round" col="1" row="0"/>
			<ScrollView col="0" row="1" colSpan="2">
				<StackLayout>
					<ShiftFilterGroup v-for="(filterValues, filterKey) in filterModel" :key="filterKey" v-model="filterModel[filterKey]" :filter-key="filterKey"></ShiftFilterGroup>
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

	export default {
		mixins: [formComponent],
		components: {
			ShiftFilterGroup
		},
		props: {
			filters: Object
		},
		data() {
			return {
				filterModel: new ShiftFilterSet(this.filters)
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

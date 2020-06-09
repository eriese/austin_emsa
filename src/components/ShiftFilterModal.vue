<template>
	<ModalStack dismissEnabled="true">
		<GridLayout width="90%" height="75%" columns="*, auto" rows="auto, *, auto, auto" class="ns-modal emsa-page filter-form">
			<Label text="Filter Shift Results" class="filter-form__header text-center" col="0" row="0"/>
			<Button text="X" @tap="$modal.close" class="pull-right ns-modal__close-button" col="1" row="0"/>
			<ScrollView col="0" row="1" colSpan="2">
				<StackLayout>
					<ShiftFilterGroup v-for="(filterValues, filterKey) in filters" :key="filterKey" v-model="filters[filterKey]" :filter-key="filterKey"></ShiftFilterGroup>
				</StackLayout>
			</ScrollView>
			<Button text="Done" @tap="$modal.close" col="0" row="2" colSpan="2"/>
		</GridLayout>

	</ModalStack>
</template>

<script>
	import formComponent from '../mixins/formComponent';
	import ShiftFilterGroup from './ShiftFilterGroup';

	export default {
		mixins: [formComponent],
		components: {
			ShiftFilterGroup
		},
		props: {
			filters: Object
		},
	}
</script>

<style lang="scss">
.filter-form {
	&__header {
		font-size: 24;
	}
}
</style>

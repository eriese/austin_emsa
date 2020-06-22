<template>
		<GridLayout columns="*" rows="auto,*">
			<StackLayout row="0" v-if="useFilters">
				<Button text="Filters" @tap="showFiltersModal" class="button"/>
				<Label textWrap="true" class="body side-padded" v-if="shifts.length == 0" text="There are currently no posts that match your search criteria. Please check back again soon, or make your own post seeking a swap"/>
			</StackLayout>
			<GridLayout row="1" rows="*" class="side-padded">
				<RadListView v-if="shifts && shifts.length" ref="list" for="shift in shifts" pullToRefresh="true" @pullToRefreshInitiated="onPullToRefresh" @itemTap="showShift($event.index)" >
					<v-template>
						<ShiftListItem :shift="shift" :key="$index"></ShiftListItem>
					</v-template>
				</RadListView>
				<StackLayout class="indicator-background" row="1" verticalAlignment="top" v-if="dataIsLoading">
					<ActivityIndicator busy="true" verticalAlignment="center"/>
				</StackLayout>
			</GridLayout>
		</GridLayout>
</template>

<script>
import ShiftList from './ShiftList.common';
import ShiftFilterModal from '../components/ShiftFilterModal';

export default ShiftList.extend({
	name: 'ShiftList',
	methods: {
		showModal(options) {
			return this.$showModal(ShiftFilterModal, options);
		},
		notifyPullToRefreshFinished(eventObject) {
			eventObject.object.notifyPullToRefreshFinished()
		},
		scrollListToIndex(index) {
			this.$refs.list && this.$refs.list.scrollToIndex(index);
		}
	}
})
</script>

<style scoped lang="scss">
</style>


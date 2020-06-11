<template>
		<GridLayout columns="*" rows="auto,*">
			<StackLayout row="0">
				<Button text="Filters" @tap="showFiltersModal"/>
				<Label textWrap="true" class="body" v-if="shifts.length == 0" text="There are currently no posts that match your search criteria. Please check back again soon, or make your own post seeking a swap"/>
			</StackLayout>
			<RadListView ref="list" for="shift in shifts" pullToRefresh="true" @pullToRefreshInitiated="onPullToRefresh" @itemTap="onShiftTap" width="100%" height="100%" row="1">
				<v-template>
					<ShiftListItem :shift="shift" :key="$index"></ShiftListItem>
				</v-template>
			</RadListView>
			<StackLayout class="indicator-background" row="1" verticalAlignment="top" v-if="dataIsLoading">
				<ActivityIndicator busy="true" verticalAlignment="center"/>
			</StackLayout>
		</GridLayout>
</template>

<script>
import ShiftList from './ShiftList.common';
import ShiftFilterModal from '../components/ShiftFilterModal';

export default ShiftList.extend({
	methods: {
		onShiftTap({index}) {
			console.log('tapped')
			this.showShift(index);
		},
		showModal(options) {
			return this.$showModal(ShiftFilterModal, options);
		},
		notifyPullToRefreshFinished(eventObject) {
			eventObject.object.notifyPullToRefreshFinished()
		},
		scrollListToIndex(index) {
			this.$refs.list.scrollToIndex(index);
		}
	}
})
</script>

<style scoped lang="scss">
.indicator-background {
	margin-top: 25;
	background-color: white;
	height: 40;
	width: 40;
	border-radius: 50%;
	padding: 5;
	z-index: 1;
	android-elevation: 4;

	ActivityIndicator {
		color: black;
	}
}
</style>


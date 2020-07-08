<template web>
	<div class="side-padded">
		<div class="text-center filter-button">
			<button @click="showFiltersModal" class="button">Filters</button>
		</div>
		<p v-if="store.currentList.length == 0">There are currently no posts that match your search criteria. Please check back again soon, or make your own post seeking a swap</p>
		<ul>
			<ShiftListItem v-for="(shift, $index) in store.currentList" :key="$index" :shift="shift"/>
		</ul>
	</div>
</template>

<template native>
	<GridLayout columns="*" rows="auto,*">
		<StackLayout row="0">
			<Button text="Filters" @tap="showFiltersModal" class="button"/>
			<Label textWrap="true" class="body side-padded" v-if="store.currentList.length == 0" text="There are currently no posts that match your search criteria. Please check back again soon, or make your own post seeking a swap"/>
		</StackLayout>
		<GridLayout row="1" rows="*" class="side-padded">
			<RadListView v-if="store.currentList && store.currentList.length" ref="list" for="shift in store.currentList" pullToRefresh="true" @pullToRefreshInitiated="onPullToRefresh" @itemTap="showShift($event.index)" >
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

<script web>
	import ShiftListCommon from './ShiftList.common';
	import ShiftFilterModal from '../components/ShiftFilterModal';
	import {create} from 'vue-modal-dialogs';

	const createModal = create(ShiftFilterModal);

	export default {
		name: 'ShiftList',
		mixins: [ShiftListCommon],
		methods: {
			showModal(options) {
				return createModal({
					...options.props
				});
			},
			onNewFilters(newFilters) {
				this.$router.push({name: 'ShiftList', query: newFilters.asQuery()});
			}
		}
	};

</script>

<script native>
	import ShiftListCommon from './ShiftList.common';
	import ShiftFilterModal from '../components/ShiftFilterModal';

	export default {
		name: 'ShiftList',
		mixins: [ShiftListCommon],
		methods: {
			showModal(options) {
				return this.$showModal(ShiftFilterModal, options);
			},
			notifyPullToRefreshFinished(eventObject) {
				eventObject.object.notifyPullToRefreshFinished()
			},
			scrollListToIndex(index) {
				this.$refs.list && this.$refs.list.scrollToIndex(index);
			},
			showShift(index) {
				this.$emit('shiftSelected', this.store.currentList[index]);
			},
		}
	}
</script>

<style scoped lang="scss">
	.filter-button {
		margin: 1rem 0 0.5rem 0;
	}
</style>

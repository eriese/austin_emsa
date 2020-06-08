<template>
		<GridLayout columns="*" rows="*">
			<RadListView ref="list" for="shift in shifts" pullToRefresh="true" @pullToRefreshInitiated="onPullToRefresh" @itemTap="showShift" class="home-panel" width="100%" height="100%" row="0">
				<v-template name="header">
					<StackLayout>
						<Button text="Filters" @tap="showFiltersModal({index: 1})"/>
						<Label textWrap="true" class="body" v-if="shifts.length == 0" text="There are currently no posts that match your search criteria. Please check back again soon, or make your own post seeking a swap"/>
					</StackLayout>
				</v-template>
				<v-template>
					<ShiftListItem :shift="shift" :key="$index"></ShiftListItem>
				</v-template>
			</RadListView>
			<StackLayout class="indicator-background" row="0" verticalAlignment="top" v-if="dataIsLoading">
				<ActivityIndicator busy="true" verticalAlignment="center"/>
			</StackLayout>
		</GridLayout>
</template>

<script>
	import Shift from './Shift';
	import ShiftListItem from './ShiftListItem';
	import ShiftFilterModal from './ShiftFilterModal';

	export default {
		components: {
			ShiftListItem
		},
		props: {
			shifts: {
				type: Array,
				default: () => []
			},
			filters: {
				type: Object,
				default: () => ({})
			}
		},
		data() {
			return {
				dataIsLoading: false,
			}
		},
		methods: {
			getShifts(filters, showLoader=true, callback) {
				this.dataIsLoading = showLoader;
				this.$emit('listRequested', filters, () => {
					this.dataIsLoading = false;

					if (typeof callback == 'function') {
						callback();
					}
				})
			},
			onPullToRefresh({object}) {
				this.$nextTick(() => {
					this.getShifts(this.filters, false, () => object.notifyPullToRefreshFinished());
				})
			},
			showFiltersModal: async function() {
				const oldFilterState = JSON.stringify(this.filters);
				const newFilters = JSON.parse(oldFilterState)
				const options = {
					props: {
						filters: newFilters
					}
				};

				await this.$showModal(ShiftFilterModal, options);

				const newFilterState = JSON.stringify(newFilters);
				if (newFilterState != oldFilterState) {
					this.getShifts(newFilters);
				}
			},
			showShift({index, object}) {
				this.$emit('shiftSelected', index);
			}
		}
	}
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

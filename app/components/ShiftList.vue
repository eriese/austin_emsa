<template>
		<GridLayout columns="*" rows="*">
			<RadListView ref="list" for="shift in shifts" pullToRefresh="true" @pullToRefreshInitiated="onPullToRefresh" class="home-panel" width="100%" height="100%" row="0">
				<v-template name="header">
					<StackLayout>
						<Button text="Filters" @tap="showFiltersModal"/>
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

	function randBool() {
		const num = Math.random();
		return num > 0.5
	}

	const randInt = (lessThan) => Math.floor(Math.random() * lessThan);
	const randMember = (ary) => ary[randInt(ary.length)];

	function getDummyInfo(filters) {
		const dummyInfo = []	;
		for (var i = 0; i < 20; i++) {
			let isField = filters.isField.length ? randMember(filters.isField) : randBool();
			let position = filters.position.length ? randMember(filters.position) : randInt(4);
			let isOffering = filters.isOffering.length ? randMember(filters.isOffering) : randBool();
			let isOCP = filters.isOCP.length ? randMember(filters.isOCP) : randBool();
			let tradePreference = filters.tradePreference.length ? randMember(filters.tradePreference) : (randInt(3) - 1);

			dummyInfo.push(new Shift({
				isField,
				position,
				isOffering,
				isOCP,
				tradePreference
			}));
		}

		return dummyInfo;
	}

	export default {
		components: {
			ShiftListItem
		}, data() {
			return {
				shifts: [],
				dataIsLoading: false,
				filters: {
					isOffering: [],
					isField: [],
					position: [],
					isOCP: [],
					tradePreference: [],
				}
			}
		}, methods: {
			getShifts(showLoader=true, callback) {
				this.dataIsLoading = showLoader;
				return new Promise((resolve) => {
					setTimeout(() => {
						console.log('getting new shifts with filters:', JSON.stringify(this.filters))
						this.shifts = getDummyInfo(this.filters);
						this.dataIsLoading = false;
						if (typeof callback == 'function') {
							callback();
						}
						resolve();
					}, 1000)
				})
			},
			onPullToRefresh({object}) {
				this.$nextTick(() => {
					this.getShifts(false, () => object.notifyPullToRefreshFinished());
				})
			},
			showFiltersModal: async function() {
				const oldFilterState = JSON.stringify(this.filters);
				const options = {
					props: {
						filters: this.filters
					}
				};

				await this.$showModal(ShiftFilterModal, options);

				this.$nextTick(() => {
					const newFilterState = JSON.stringify(this.filters);
					console.log(oldFilterState, newFilterState);
					if (newFilterState != oldFilterState) {
						this.getShifts();
					}
				})
			}
		}, created() {
			this.getShifts();
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

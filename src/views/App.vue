<template>
	<Page class="emsa-root" actionBarHidden="true">
		<component :is="currentPage" v-bind="currentPageProps" v-on="currentPageListeners" class="emsa-page" />
	</Page>
</template>
<template web>
	<component :is="currentPage" v-bind="currentPageProps" v-on="currentPageListeners" class="emsa-page" />
</template>

<script>
// import ShiftForm from './ShiftForm';
import ShiftList from './ShiftList';
import ShiftView from './ShiftView';
import Login from './Login';
import {getDummyShift} from '../components/Shift';
import ApiService from '../components/ApiService';

// function getDummyInfo(filters) {
// 	const dummyInfo = []	;
// 	for (var i = 0; i < 20; i++) {
// 		dummyInfo.push(getDummyShift(filters));
// 	}

// 	return dummyInfo;
// }

export default {
	components: {
		// ShiftForm,
		ShiftList,
		ShiftView,
		Login
	},
	data() {
		const currentFilters = {
			isOffering: [false],
			isField: [],
			position: [],
			isOCP: [],
			tradePreference: [0, 1],
		};

		let currentPage = Login;
		const currentList = this.loadList(currentFilters, this.backToList);

		return {
			currentPage,
			selectedShift: getDummyShift(),
			selectedIndex: 0,
			currentList,
			currentFilters,
		};
	},
	computed: {
		currentPageProps() {
			switch(this.currentPage) {
				case ShiftList:
					return {
						shifts: this.currentList,
						filters: this.currentFilters,
						scrollIndex: this.selectedIndex
					};
				case ShiftView:
					return {
						shift: this.currentList[this.selectedIndex]
					}
			}
			return {};
		},
		currentPageListeners() {
			switch(this.currentPage) {
				case ShiftList:
					return {
						shiftSelected: this.onShiftSelected,
						listRequested: this.loadList,
					};
				case ShiftView:
					return {
						back: this.backToList,
					};
				case Login:
					return {
						authSuccess: () => {
							this.loadList(this.currentFilters, this.backToList);
						}
					};
			}

			return {};
		}
	},
	methods: {
		onShiftSelected(listIndex) {
			this.selectedIndex = listIndex;
			this.currentPage = ShiftView;
		},
		backToList() {
			this.currentPage = ShiftList;
		},
		loadList(newFilters, callback, onError) {
			this.currentFilters = newFilters;

			return ApiService.getShifts(this.currentFilters, (newList) => {
				this.currentList = newList.sort((a, b) => {
					let diff = new Date(a.shiftDate) - new Date(b.shiftDate);
					if (diff == 0) {
						diff = new Date(a.shiftState) - new Date(b.shiftStart);
					}

					return diff;
				});

				if (typeof callback == 'function') {
					callback();
				}
			}, onError);

			// setTimeout(() => {
			// 	this.currentList = getDummyInfo(this.currentFilters);

			// 	if (typeof callback == 'function') {
			// 		callback();
			// 	}
			// }, 1000)
		}
	},
}
</script>

<style lang="scss">
@import '../app.scss';

</style>

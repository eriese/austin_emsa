<template native>
	<Page class="emsa-root" actionBarHidden="true">
		<component :is="currentPage" v-bind="currentPageProps" @shiftSelected="onShiftSelected" @back="backToList" @listRequested="loadList" class="emsa-page" />
	</Page>
</template>
<template web>
	<component :is="currentPage" v-bind="currentPageProps" @shiftSelected="onShiftSelected" @back="backToList" @listRequested="loadList" class="emsa-page" />
</template>

<script>
// import ShiftForm from './ShiftForm';
import ShiftList from './ShiftList';
import ShiftView from './ShiftView';
import {getDummyShift} from '../components/Shift';

function getDummyInfo(filters) {
	const dummyInfo = []	;
	for (var i = 0; i < 20; i++) {
		dummyInfo.push(getDummyShift(filters));
	}

	return dummyInfo;
}

export default {
	components: {
		// ShiftForm,
		ShiftList,
		ShiftView,
	},
	data() {
		const currentFilters = {
			isOffering: [],
			isField: [],
			position: [],
			isOCP: [],
			tradePreference: [],
		};

		const currentList = this.loadList(currentFilters);

		return {
			currentPage: ShiftList,
			selectedShift: getDummyShift(),
			selectedIndex: 0,
			currentList,
			currentFilters
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
		loadList(newFilters, callback) {
			this.currentFilters = newFilters;
			setTimeout(() => {
				this.currentList = getDummyInfo(this.currentFilters);

				if (typeof callback == 'function') {
					callback();
				}
			}, 1000)
		}
	},
}
</script>

<style lang="scss">
</style>

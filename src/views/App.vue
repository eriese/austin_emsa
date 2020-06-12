<template>
	<Page class="emsa-root" actionBarHidden="true">
		<StackLayout>
			<StackLayout class="indicator-background" row="1" verticalAlignment="center" v-if="pageIsLoading">
					<ActivityIndicator busy="true" verticalAlignment="center"/>
			</StackLayout>
			<component :is="currentPage" v-bind="currentPageProps" v-on="currentPageListeners" class="emsa-page" />
		</StackLayout>
	</Page>
</template>
<template web>
	<component :is="currentPage" v-bind="currentPageProps" v-on="currentPageListeners" class="emsa-page" />
</template>

<script>
import ShiftForm from './ShiftForm';
import ShiftList from './ShiftList';
import ShiftView from './ShiftView';
import Login from './Login';
import ApiService from '../components/ApiService';
import AuthChecker from '../components/authChecker';

export default {
	components: {
		ShiftForm,
		ShiftList,
		ShiftView,
		Login
	},
	data() {
		const currentFilters = {
			isOffering: [false],
			isField: [],
			position: [],
			isOcp: [],
			tradePreference: [0, 1],
		};

		let currentPage = Login;
		const currentList = this.loadList(currentFilters, this.backToList);

		return {
			currentPage,
			selectedShift: {},
			selectedIndex: 0,
			currentList,
			currentFilters,
			pageIsLoading: true,
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
						shift: this.selectedShift
					}
			}
			return {};
		},
		currentPageListeners() {
			let listeners = {}
			switch(this.currentPage) {
				case ShiftList:
					listeners = {
						shiftSelected: this.onShiftSelected,
						listRequested: this.loadList,
						logout: () => {
							AuthChecker.clearAuthToken();
							this.setCurrentPage(Login);
						},
						addPost: () => {
							this.setCurrentPage(ShiftForm);
						}
					};
					break;
				case ShiftView:
				case ShiftForm:
					listeners = {
						back: this.backToList,
					};
					break;
				case Login:
					listeners = {
						authSuccess: () => {
							this.backToList();
							this.loadList(this.currentFilters);
						}
					};
					break;
			}

			return {
				...listeners,
				pageMounted: () => {
					this.pageIsLoading = false;
				}
			};
		}
	},
	methods: {
		setCurrentPage(page) {
			this.pageIsLoading = true;
			this.currentPage = page;
		},
		onShiftSelected(listIndex) {
			this.selectedIndex = listIndex;
			this.selectedShift = this.currentList[listIndex]
			this.setCurrentPage(ShiftView);
		},
		backToList() {
			this.selectedShift = undefined;
			this.setCurrentPage(ShiftList);
		},
		loadList(newFilters, callback) {
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
			}, () => {
				this.setCurrentPage(Login);
			});
		}
	},
}
</script>

<style lang="scss">
@import '../app.scss';

.fade-enter-active {
	animation-name: fade;
	animation-delay: 0.3s;
	animation-duration: 0.3s;
	animation-timing-function: ease-in-out;
	// animation-fill-mode: backwards;
}

.fade-leave-active {
	animation-name: fade;
	animation-duration: 0.3s;
	animation-timing-function: ease-in-out;
	animation-direction: reverse;
	animation-fill-mode: forwards;
}

@keyframes fade {
	0% {
		opacity: 0;
	}

	100% {
		opacity: 1;
	}
}
</style>

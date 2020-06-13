<template>
	<Page class="emsa-root" actionBarHidden="true">
		<component :is="currentPage" v-bind="currentPageProps" v-on="currentPageListeners" class="emsa-page" ref="page" width="100%"/>
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
import gsap from 'gsap';

export default {
	components: {
		ShiftForm,
		ShiftList,
		ShiftView,
		Login
	},
	data() {
		const currentFilters = {
			isOffering: [],
			isField: [],
			position: [],
			isOcp: [],
			tradePreference: [],
		};

		return {
			currentPage: null,
			selectedShift: {},
			selectedIndex: 0,
			currentList: [],
			currentFilters,
			pageIsLoading: true,
			prevPage: null
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
		saveState() {
			AuthChecker.saveState({
				currentPage: this.currentPage.name,
				selectedShift: this.selectedShift,
				currentList: this.currentList,
				currentFilters: this.currentFilters,
				prevPage: this.prevPage.name
			})
		},
		setCurrentPage(page) {
			return new Promise((resolve) => {
				if (page === this.currentPage) {
					resolve();
					return;
				}

				this.pageIsLoading = true;
				this.prevPage = this.currentPage;
				const leaving = this.$refs.page.$el.nativeView;
				const direction = this.prevPage === Login || this.prevPage === ShiftList ? 'marginLeft' : 'marginRight';
				gsap.to(leaving, 0.2, {
					[direction]: '200%',
					onComplete: () => {
						this.currentPage = page;
						this.saveState();
						resolve();
					}
				})
			})
		},
		onShiftSelected(listIndex) {
			this.selectedIndex = listIndex;
			this.selectedShift = this.currentList[listIndex]
			this.setCurrentPage(ShiftView);
		},
		backToList() {
			this.setCurrentPage(ShiftList).then(() => {
				this.selectedShift = undefined;
			});
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

				this.saveState();
				if (typeof callback == 'function') {
					callback();
				}
			}, () => {
				this.setCurrentPage(Login);
			});
		}
	},
	created() {
		const state = AuthChecker.getState();
		Object.assign(this, state);

		if (state.currentPage == 'ShiftForm') {
			this.currentPage = ShiftForm;
		} else if (state.selectedShift) {
			this.currentPage = ShiftView;
		} else if (state.currentList) {
			this.currentPage = ShiftList;
		} else {
			this.currentPage = {
				template: '<Label/>'
			};
			this.loadList(this.currentFilters, this.backToList);
		}
	}
}
</script>

<style lang="scss">
@import '../app.scss';
</style>

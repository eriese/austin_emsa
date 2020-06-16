<template>
	<Page class="emsa-root" actionBarHidden="true">
		<GridLayout rows="*, auto">
			<component row="0" :is="currentPage" v-bind="currentPageProps" v-on="currentPageListeners" class="emsa-page" ref="page" width="100%"/>
			<SegmentedBar row="1" v-if="isAuthed" :selectedIndex="selectedTab" @selectedIndexChange="tabSelect" class="emsa-menu">
				<SegmentedBarItem title="Post a Shift" class="emsa-menu__item" />
				<SegmentedBarItem title="Find a Shift" class="emsa-menu__item" />
				<SegmentedBarItem title="My Posts" class="emsa-menu__item" />
			</SegmentedBar>
		</GridLayout>
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
import UserView from './UserView';
import ApiService from '../components/ApiService';
import AuthChecker from '../components/authChecker';
import gsap from 'gsap';

const tabOrder = [ShiftForm, ShiftList, UserView];

export default {
	components: {
		ShiftForm,
		ShiftList,
		ShiftView,
		Login,
		UserView
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
			selectedShift: null,
			selectedIndex: 0,
			currentList: [],
			currentFilters,
			pageIsLoading: true,
			prevPage: null,
			selectedTab: 1,
		};
	},
	computed: {
		isAuthed() {
			return this.currentPage != Login;
		},
		currentPageProps() {
			switch(this.currentPage) {
				case ShiftList:
					return {
						shifts: this.currentList,
						filters: this.currentFilters,
						scrollIndex: this.selectedIndex,
						useFilters: true,
					};
				case ShiftView:
					return {
						shift: this.selectedShift,
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
					};
					break;
				case UserView:
					listeners = {
						shiftSelected: this.onShiftSelected,
						back: this.backToList
					}
					break;
				case Login:
					listeners = {
						authSuccess: () => {
							this.backToList();
							this.loadList(this.currentFilters);
						}
					};
					break;
				case ShiftView:
					listeners = {
						back: !this.selectedShift.isUser ? this.backToList : () => this.setCurrentPage(UserView),
					}
					break;
				default:
					listeners = {
						back: this.backToList,
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
			if (!this.currentPage) {return;}

			AuthChecker.saveState({
				currentPage: this.currentPage.name,
				selectedShift: this.selectedShift,
				prevPage: this.prevPage && this.prevPage.name,
				currentFilters: this.currentFilters,
				currentList: this.currentList,
			});
		},
		tabSelect(event) {
			const {value, oldValue} = event;
			if (oldValue < 0) {
				return;
			}

			const page = tabOrder[value];
			this.setCurrentPage(page);
		},
		getTabIndex() {
			if (this.currentPage === Login) {
				return;
			}

			let checkPage = this.currentPage;
			if (checkPage === ShiftView) {
				checkPage = this.selectedShift.isUser ? UserView : ShiftList;
			}

			console.log('checking tab order of ', checkPage.name);
			let tabIndex = tabOrder.indexOf(checkPage);

			if (tabIndex >= 0) {
				this.selectedTab = tabIndex;
			}
		},
		setCurrentPage(page) {
			return new Promise((resolve) => {
				if (!this.currentPage || page === this.currentPage) {
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
						this.getTabIndex();
						this.saveState();
						resolve();
					}
				})
			})
		},
		onShiftSelected(indexOrShift, isUser = false) {
			if (isUser) {
				this.selectedShift = indexOrShift;
			} else {
				this.selectedIndex = indexOrShift;
				this.selectedShift = this.currentList[indexOrShift]
			}
			this.setCurrentPage(ShiftView);
		},
		backToList() {
			this.setCurrentPage(ShiftList).then(() => {
				this.selectedShift = undefined;
				this.saveState();
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

		let currentPage;
		switch(state.currentPage) {
			case 'Login':
				currentPage = Login;
				break;
			case 'ShiftForm':
				currentPage = ShiftForm;
				break;
			case 'UserView':
				currentPage = UserView;
				break;
			default:
				if (state.selectedShift) {
					currentPage = ShiftView;
				} else {
					currentPage = state.currentList ? ShiftList : {
						template: '<Label/>'
					};

					this.loadList(this.currentFilters, this.backToList);
				}
		}

		this.currentPage = currentPage;
		this.getTabIndex();
	}
}
</script>

<style lang="scss">
@import '../app.scss';
</style>

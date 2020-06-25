<template>
	<Page class="emsa-root" actionBarHidden="true">
		<GridLayout rows="*, auto">
			<component :is="views[currentRoute]" v-on="currentPageListeners" class="emsa-page" ref="page" row="0"/>
			<FlexboxLayout class="emsa-menu" row="1">
				<Button class="emsa-menu__item text-center" v-for="(tab, $index) in menuTabs" :text="tab.title" @tap="tab.action" :class="{'emsa-menu__item--is-selected': tab.isSelected}" :key="$index" flexGrow="1"/>
			</FlexboxLayout>
		</GridLayout>
	</Page>
</template>

<template web>
	<router-view class="emsa-page" />
</template>

<script>
import Views from './Views';
import AuthChecker from '../services/AuthChecker';
// import gsap from 'gsap';
import {ShiftFilterSet} from '../models/Shift';
import Store from '../services/Store';

export default {
	data() {
		const data = {
			store: Store,
		};

		if (process.env.VUE_APP_MODE == 'native') {
			data.currentPage = null;
			data.prevPage = null;
			data.views = Views;
		}

		return data;
	},
	computed: {
		isAuthed() {
			return this.currentRoute != 'Login';
		},
		currentRoute() {
			return this.$route ? this.$route.name : this.currentPage && this.currentPage.name;
		},
		currentPageListeners() {
			const backToList = () => this.setCurrentPage(this.views.ShiftList);

			let listeners = {}
			switch(this.currentRoute) {
				case 'ShiftList':
					listeners = {
						shiftSelected: this.onShiftSelected,
						listRequested: this.loadList,
					};
					break;
				case 'UserView':
					listeners = {
						shiftSelected: this.onShiftSelected,
						back: backToList,
						logout: () => {
							AuthChecker.logout();
							this.currentFilters = new ShiftFilterSet();
							this.setCurrentPage(this.views.Login);
						},
					};
					break;
				case 'Login':
					listeners = {
						authSuccess: () => {
							this.loadList(this.store.currentFilters);
							backToList();
						}
					};
					break;
				case 'ShiftView':
					listeners = {
						back: () => {
							const listPage = this.store.selectedShift.isUser ? this.views.UserView : this.views.ShiftList;
							this.setCurrentPage(listPage)
						}
					}
					break;
				default:
					listeners = {
						back: backToList,
					};
					break;
			}

			return listeners;
		},
		menuTabs() {
			if (this.isAuthed) {
				const curShift = this.store.selectedShift;
				return [{
					title: 'Post a Shift',
					action: () => this.setCurrentPage(this.views.ShiftForm),
					isSelected: this.currentRoute == 'ShiftForm'
				}, {
					title: 'Find a Shift',
					action: () => this.setCurrentPage(this.views.ShiftList),
					isSelected: this.currentRoute == 'ShiftList' || (curShift && !curShift.isUser),
				}, {
					title: 'My Posts',
					action: () => this.setCurrentPage(this.views.UserView),
					isSelected: this.currentRoute == 'UserView' || (curShift && curShift.isUser)
				}]
			}

			return [{
				title: 'Returning User',
				action: () => this.store.loginIndex = 0,
				isSelected: this.store.loginIndex == 0
			}, {
				title: 'New User',
				action: () => this.store.loginIndex = 1,
				isSelected: this.store.loginIndex == 1
			}];
		},
	},
	methods: {
		saveState() {
			if (process.env.VUE_APP_MODE == 'web' || !this.currentRoute) {return;}

			const state = {
				currentPage: this.currentRoute,
				selectedShift: this.store.selectedShift,
				prevPage: this.prevPage && this.prevPage.name,
				currentFilters: this.store.currentFilters,
				currentList: this.store.currentList,
			};

			AuthChecker.saveState(state);
		},
		setCurrentPage(page) {
			return new Promise((resolve) => {
				if (!this.currentPage || page === this.currentPage) {
					resolve();
					return;
				}

				this.prevPage = this.currentPage;

				const onComplete = () => {
					this.currentPage = page;
					if (page != this.views.ShiftView) {
						this.store.selectedShift = null;
					}
					this.saveState();
					resolve();
				}
				// const leaving = this.$refs.page.$el.nativeView;
				// const direction = this.prevPage === Login || this.prevPage === ShiftList ? 'marginLeft' : 'marginRight';
				// if (process.env.VUE_APP_PLATFORM == 'ios') {
					onComplete();
				// } else {
				// 	gsap.to(leaving, 0.2, {
				// 		[direction]: '200%',
				// 		onComplete
				// 	})
				// }
			})
		},
		onShiftSelected(shift) {
			this.store.selectedShift = shift;
			this.setCurrentPage(this.views.ShiftView);
		},
		loadList(newFilters, callback) {
			if (!this.store.currentFilters.equals(newFilters)) {
				this.store.currentFilters = newFilters;
			}

			this.store.loadList(callback);
		}
	},
	created() {
		this.store.onListError = () => this.setCurrentPage(this.views.Login);
		this.store.saveStateMethod = this.saveState;

		if (process.env.VUE_APP_MODE == 'native') {
			const state = AuthChecker.getState();
			this.store.reviveState(state);

			this.currentPage = this.views['ShiftList'];
		}
	}
}
</script>

<style lang="scss">
@import '../app.scss';
</style>

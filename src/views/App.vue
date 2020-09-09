<template>
	<Page class="emsa-root" actionBarHidden="true">
		<GridLayout rows="auto,*, auto">
			<Label class="notification text-center" textWrap="true" :text="notification" row="0"/>
			<component :is="views[currentRoute]" v-on="currentPageListeners" class="emsa-page" ref="page" row="1"/>
			<FlexboxLayout class="emsa-menu" row="2">
				<Button class="emsa-menu__item text-center" v-for="(tab, $index) in menuTabs" :text="tab.title" @tap="tab.action" :class="{'emsa-menu__item--is-selected': tab.isSelected}" :key="$index" flexGrow="1"/>
			</FlexboxLayout>
		</GridLayout>
	</Page>
</template>

<template web>
	<div class="emsa-root">
		<header>
			<nav>
				<ul class="emsa-menu">
					<li v-for="(tab, $index) in menuTabs" :key="$index" class="emsa-menu__item" :class="{'emsa-menu__item--is-selected': tab.isSelected}">
						<router-link :to="tab.route">{{tab.title}}</router-link>
					</li>
				</ul>
			</nav>
		</header>
		<main>
			<div class="notification text-center">{{notification}}</div>
			<router-view class="emsa-page" v-on="currentPageListeners"/>
		</main>
		<dialogs-wrapper/>
	</div>
</template>

<script>
import Views from './Views';
import AuthChecker from '../services/AuthChecker';
// import gsap from 'gsap';
import Store from '../services/Store';

export default {
	data() {
		const data = {
			store: Store,
			notification: '',
		};

		if (process.env.VUE_APP_MODE == 'native') {
			data.currentPage = null;
			data.prevPage = null;
			data.views = Views;
		}

		return data;
	},
	computed: {
		currentRoute() {
			return this.$route ? this.$route.name : this.currentPage && this.currentPage.name;
		},
		currentPageListeners() {
			const backToList = () => this.setCurrentPage('ShiftList');

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
						logout: this.logout,
					};
					break;
				case 'Login':
				case 'AdminLogin':
				case 'Signup':
					listeners = {
						authSuccess: (isAdmin) => {
							this.store.isAuthed = true;
							if (isAdmin) {
								this.setCurrentPage('AdminApproval')
							} else {
								backToList();
							}
						}
					};
					break;
				case 'ShiftView':
					listeners = {
						back: () => {
							const listPage = this.store.selectedShift.isUser ? 'UserView' : 'ShiftList';
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
			if (this.currentRoute && this.currentRoute.includes('Admin')) {

				if (this.currentRoute == 'AdminLogin') {
					return [];
				}

				return [{
					title: 'Manage Admins',
					route: {name: 'AdminManagement'},
					isSelected: this.currentRoute == 'AdminManagement'
				},
				{
					title: 'Approve Users',
					route: {name: 'AdminApproval'},
					isSelected: this.currentRoute == 'AdminApproval'
				},
				{
					title: 'App Codes',
					route: {name: 'AdminCodes'},
					isSelected: this.currentRoute == 'AdminCodes'
				}];
			}

			if (this.store.isAuthed) {
				const curShift = this.store.selectedShift;
				return [{
					title: 'Post a Shift',
					action: () => this.setCurrentPage('ShiftForm'),
					isSelected: this.currentRoute == 'ShiftForm',
					route: {name: 'ShiftForm'}
				}, {
					title: 'Find a Shift',
					action: () => this.setCurrentPage('ShiftList'),
					isSelected: this.currentRoute == 'ShiftList' || (curShift && !curShift.isUser),
					route: {name: 'ShiftList'}
				}, {
					title: 'My Account',
					action: () => this.setCurrentPage('UserView'),
					isSelected: this.currentRoute == 'UserView' || (curShift && curShift.isUser),
					route: {name: 'UserView'}
				}]
			}

			return [{
				title: 'Returning User',
				action: () => this.store.loginIndex = 0,
				isSelected: this.store.loginIndex == 0,
				route: {name: 'Login'}
			}, {
				title: 'New User',
				action: () => this.store.loginIndex = 1,
				isSelected: this.store.loginIndex > 0,
				route: {name: 'Signup'}
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
		setCurrentPage(pageName) {
			if (process.env.VUE_APP_MODE == 'web') {
				let query = pageName == 'ShiftList' ? this.store.currentFilters : {}
				return this.$router.push({name: pageName, query});
			}

			return new Promise((resolve) => {
				const page = this.views[pageName];
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
			this.setCurrentPage('ShiftView');
		},
		loadList(newFilters, callback) {
			if (!this.store.currentFilters.equals(newFilters)) {
				this.store.currentFilters = newFilters;
			}

			this.store.loadList(callback);
		},
		logout: async function() {
			const loggedOut = await this.store.logout();
			if (loggedOut) {
				this.store.isAuthed = false;
				this.setCurrentPage('Login');
			} else {
				this.notify('Somehow we were unable to log you out. Please try again later');
			}
		},
		notify(notification) {
			this.notification = notification;
			setTimeout(() => {this.notification = ''}, 60000);
		}
	},
	created() {
		this.store.onListError = this.logout;
		this.store.saveStateMethod = this.saveState;

		if (process.env.VUE_APP_MODE == 'native') {
			this.store.testToken();

			const state = AuthChecker.getState();
			this.store.reviveState(state);
			const currentPage = state.currentPage || (this.store.isAuthed ? 'ShiftList' : 'Login');
			this.currentPage = this.views[currentPage];
		}
	}
}
</script>

<style lang="scss" web>
@import 'reset-css';
button {
	font: unset;
}
@import '../app.scss';
@import '../assets/css/fontawesome/fontawesome.min.css';
@import '../assets/css/fontawesome/solid.min.css';
</style>

<template>
	<Page class="emsa-root" actionBarHidden="true">
		<GridLayout rows="auto,*,auto,auto">
			<Label class="notification text-center" textWrap="true" :text="notification" row="0"/>
			<component :is="views[currentRoute]" v-on="currentPageListeners" class="emsa-page" ref="page" row="1" v-bind="currentPageProps"/>
			<TabMenu :current-route="currentRoute" @route="setCurrentPage" row="2"></TabMenu>
			<Label class="version-code text-right" :text="`${$root.versionName}`" row="3"/>
		</GridLayout>
	</Page>
</template>

<template web>
	<div class="emsa-root">
		<header>
			<TabMenu :current-route="currentRoute" @route="setCurrentPage"></TabMenu>
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
import TabMenu from '../components/TabMenu';
// import gsap from 'gsap';
import Store from '../services/Store';

export default {
	components: {
		TabMenu
	},
	data() {
		const data = {
			store: Store,
			notification: '',
		};

		if (process.env.VUE_APP_MODE == 'native') {
			data.currentPage = null;
			data.prevPage = null;
			data.views = Views;
			data.currentPageProps = {};
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
				case 'PasswordReset':
				case 'SubmitConfirmation':
					listeners = {
						authSuccess: (isAdmin) => {
							this.store.isAuthed = true;
							if (isAdmin) {
								this.setCurrentPage('AdminApproval')
							} else {
								this.store.getConfig();
								backToList();
							}
						},
						authFailure: () => {
							this.setCurrentPage('Login');
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
				case 'ForgotPassword':
				case 'ConfirmEmail':
					listeners = {
						back: () => this.setCurrentPage('Login')
					};
					break;
				default:
					listeners = {
						back: backToList,
					};
					break;
			}

			return {...listeners, navigate: this.setCurrentPage};
		},
	},
	methods: {
		saveState() {
			if (process.env.VUE_APP_MODE == 'web' || !this.currentRoute) {return;}

			const state = {
				currentPage: this.currentRoute,
				currentPageProps: this.currentPageProps,
				selectedShift: this.store.selectedShift,
				prevPage: this.prevPage && this.prevPage.name,
				currentFilters: this.store.currentFilters,
				currentList: this.store.currentList,
			};

			AuthChecker.saveState(state);
		},
		setCurrentPage(pageName, currentPageProps = {}) {
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
					this.currentPageProps = currentPageProps;
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
	created: async function() {
		this.store.onListError = this.logout;
		this.store.saveStateMethod = this.saveState;
		if (process.env.NODE_ENV == 'production') {
			AuthChecker.clearAllOnFirstRun();
		}

		if (process.env.VUE_APP_MODE == 'native') {
			await this.store.testToken();
			const state = AuthChecker.getState();
			this.store.reviveState(state);

			const currentPage = this.store.isAuthed ? (state.currentPage || 'ShiftList') : 'Login';
			this.currentPage = this.views[currentPage];
		}

		await this.store.getConfig();
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

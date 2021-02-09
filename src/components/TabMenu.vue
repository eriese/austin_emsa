<template native>
	<FlexboxLayout class="emsa-menu">
		<Button class="emsa-menu__item text-center" v-for="(tab, $index) in menuTabs" :text="tab.title" @tap="tab.action" :class="{'emsa-menu__item--is-selected': tab.isSelected,  'emsa-menu__item--is-not-selected': !tab.isSelected && $index > 0}" :key="$index" flexGrow="1"/>
	</FlexboxLayout>
</template>

<template web>
	<nav>
		<ul class="emsa-menu">
			<li v-for="(tab, $index) in menuTabs" :key="$index" class="emsa-menu__item" :class="{'emsa-menu__item--is-selected': tab.isSelected, 'emsa-menu__item--is-not-selected': !tab.isSelected && $index > 0}">
				<router-link :to="tab.route">{{tab.title}}</router-link>
			</li>
		</ul>
	</nav>
</template>

<script>
	import Store from '../services/Store';

	export default {
		data() {
			return {
				store: Store
			}
		},
		props: {
			currentRoute: String
		},
		computed: {
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
					action: () => this.$emit('route', 'ShiftForm'),
					isSelected: this.currentRoute == 'ShiftForm',
					route: {name: 'ShiftForm'}
				}, {
					title: 'Find a Shift',
					action: () => this.$emit('route', 'ShiftList'),
					isSelected: this.currentRoute == 'ShiftList' || (curShift && !curShift.isUser),
					route: {name: 'ShiftList'}
				}, {
					title: 'Station Codes',
					action: () => this.$emit('route', 'StationCodes'),
					isSelected: this.currentRoute == 'StationCodes',
					route: {name: 'StationCodes'}
				},{
					title: 'My Account',
					action: () => this.$emit('route', 'UserView'),
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
		}
	}
</script>

<style scoped lang="scss">
	.emsa-menu {
		font-weight: bold;
		border-bottom-width: 5;
		border-bottom: 5px solid;
		border-color: var(--emsa-blue);
		font-size: 12;
		display: flex;
		margin-top: 10;
		width: 100%;
		padding-inline-start: 0;

		&__item {
			list-style-type: none;
			padding: 10 5;
			margin: 0;
			height: auto;
			background-color: var(--emsa-blue);
			color: var(--emsa-yellow);
			android-elevation: 0;
			border-radius: 0;
			border-width: 1;
			border-color: var(--emsa-blue);

			flex-grow: 1;
			border-left: 2px solid;
			border-left-width: 2;

			// &--is-first {
			// 	border-left-color: var(--emsa-blue);
			// }

			a {
				color: inherit;
				text-decoration: none;
				display: block;
				text-align: center;
				padding: 10px;
			}

			&--is-selected, a:hover {
				color: var(--emsa-blue);
				border-color: var(--emsa-yellow);
				border-bottom-color: var(--emsa-blue);
				background-color: var(--emsa-yellow);
			}

			&--is-not-selected {
				border-color: var(--emsa-blue);
				border-left-color: var(--emsa-yellow);
			}
		}
	}

</style>

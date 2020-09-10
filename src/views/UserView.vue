<template native>
	<GridLayout rows="auto, *, auto">
		<TitleAndBackButton @backPressed="$emit('back')" row="0" text="My Account"/>
		<Label class="h2 text-center" text="My Posts"/>
		<Label textWrap="true" class="body text-center side-padded" v-if="shifts.length == 0" row="1" text="You don't have any open shift posts" verticalAlignment="top"/>
		<StackLayout row="1" class="side-padded">
			<RadListView v-if="shifts" ref="list" for="shift in shifts" pullToRefresh="true" @pullToRefreshInitiated="getShifts" @itemTap="showShift($event.index)">
				<v-template>
					<ShiftListItem :shift="shift" :key="$index"></ShiftListItem>
				</v-template>
			</RadListView>
		</StackLayout>
		<Button class="button" text="Log Out" row="2" @tap="$emit('logout')" marginBottom="0"/>
	</GridLayout>
</template>

<template web>
	<div class="side-padded">
		<back-button />
		<h1 class="h1 text-center">My Account</h1>
		<div class="text-center user-view-section">
			<router-link :to="{name: 'AdminApproval'}" v-if="store.isAdmin" class="button">Admin Panel</router-link>
		</div>
		<div class="user-view-section text-center">
			<h2 class="h2 text-center">My App Store Codes</h2>
			<p class="p">(you need one of these to download the iOS app)</p>
			<ul v-if="appCodes.length" class="plain-list">
				<li v-for="code in appCodes" :key="code.id">
					<a class="link" :href="`https://apps.apple.com/WebObjects/MZFinance.woa/wa/freeProductCodeWizard?code=${code.code}`">{{code.code}}</a>
				</li>
			</ul>
			<p class="p text-center" v-else>You don't have any app store codes</p>
			<button class="button" @click="requestCode">Request a new code</button>
		</div>
		<div class="user-view-section">
			<h2 class="h2 text-center">My Posts</h2>
			<ul v-if="shifts.length">
				<ShiftListItem v-for="(shift, $index) in shifts" :key="$index" :shift="shift" :is-user="true"/>
			</ul>
			<p class="text-center p" v-else>You don't have any current shifts posted. <router-link :to="{name: 'ShiftForm'}" class="link">Make a new post</router-link></p>
		</div>
		<div class="text-center">
			<button class="button" @click="$emit('logout')" type="button">Log Out</button>
		</div>
	</div>
</template>

<script>
	import ShiftListItem from '../components/ShiftListItem';
	import ApiService from '../services/ApiService';
	import EmsaPage from '../mixins/EmsaPage';

	export default {
		name: 'UserView',
		mixins: [EmsaPage],
		components: {
			ShiftListItem
		},
		data() {
			return {
				appCodes: [],
				codeStatusText: ''
			};
		},
		props: {
			scrollIndex: Number
		},
		computed: {
			shifts() {
				return this.store.userList;
			},
		},
		methods: {
			showShift(index) {
				let shift = this.shifts[index];
				shift.isUser = true;
				this.$emit('shiftSelected', shift, true);
			},
			getShifts($event) {
				const notify = () => {
					$event && $event.object.notifyPullToRefreshFinished();
				};

				ApiService.getShifts({is_user: true}, shifts => {
					this.store.userList = shifts;
					notify();
				}, error => {
					if (error.response && error.response.status == 401) {
						this.$emit('logout');
					} else {
						notify();
					}
				})
			},
			requestCode() {
				this.codeStatusText = 'Requesting...'
				ApiService.requestCode().then(response => {
					this.codeStatusText = '';
					this.appCodes.push(response.data);
				}).catch((e) => {
					this.codeStatusText = e;
				})
			}
		},
		mounted() {
			this.getShifts();
			ApiService.getUserCodes().then((response) => this.appCodes = response.data);
		}
	}
</script>

<style scoped>
.user-view-section {
	margin-bottom: 1rem;
	margin-bottom: 15;
}
</style>

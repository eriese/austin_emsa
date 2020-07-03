<template native>
	<GridLayout rows="auto, *, auto">
		<TitleAndBackButton @backPressed="$emit('back')" row="0" text="My Posts"/>
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
		<h1 class="h1 text-center">My Posts</h1>
		<ul>
			<ShiftListItem v-for="(shift, $index) in shifts" :key="$index" :shift="shift" :is-user="true"/>
		</ul>
		<div class="text-center">
			<button class="button" @click="$emit('logout')">Log Out</button>
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
		props: {
			scrollIndex: Number
		},
		computed: {
			shifts() {
				return this.store.userList;
			}
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
			}
		},
		mounted() {
			this.getShifts();
		}
	}
</script>

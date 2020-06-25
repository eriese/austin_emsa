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
	<h1>User View</h1>
</template>

<script>
	import ShiftListItem from '../components/ShiftListItem';
	import ApiService from '../services/ApiService';

	export default {
		name: 'UserView',
		components: {
			ShiftListItem
		},
		data() {
			return {
				shifts: [],
			}
		},
		props: {
			scrollIndex: Number
		},
		methods: {
			showShift(index) {
				let shift = this.shifts[index];
				shift.isUser = true;
				this.$emit('shiftSelected', shift, true);
			},
			getShifts($event) {
				ApiService.getShifts({is_user: true}, (shifts) => {
					this.shifts = shifts;

					$event && $event.object.notifyPullToRefreshFinished();
				})
			}
		},
		mounted() {
			this.getShifts();
		}
	}
</script>

<template>
	<GridLayout rows="auto, *, auto">
		<BackButton @backPressed="$emit('back')"/>
		<Label text="My Posts" row="0" class="h1 text-center"/>
		<Label textWrap="true" class="body" v-if="shifts.length == 0" row="1" text="You don't have any open shift posts"/>
		<RadListView v-else ref="list" for="shift in shifts" pullToRefresh="true" @pullToRefreshInitiated="getShifts" @itemTap="showShift($event.index)" row="1">
			<v-template>
				<ShiftListItem :shift="shift" :key="$index"></ShiftListItem>
			</v-template>
		</RadListView>
		<Button text="Log Out" row="2" @tap="$emit('logout')"/>
	</GridLayout>
</template>

<script>
	import ShiftListItem from '../components/ShiftListItem';
	import ApiService from '../components/ApiService';

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

					$event.object.notifyPullToRefreshFinished();
				})
			}
		},
		mounted() {
			this.getShifts();
		}
	}
</script>

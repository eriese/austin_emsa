<template>
	<RadListView ref="list" for="shift in shifts" pullToRefresh="true" @pullToRefreshInitiated="onPullToRefresh" class="home-panel">
		<v-template name="header">
			<Label text="Filters will go here" />
		</v-template>
		<v-template>
			<ShiftListItem :shift="shift" :key="$index"></ShiftListItem>
		</v-template>
	</RadListView>
</template>

<script>
	import Shift from './Shift';
	import ShiftListItem from './ShiftListItem';
	import { Frame } from "tns-core-modules/ui/frame";

	function randBool() {
		const num = Math.random();
		return num > 0.5
	}

	function getDummyInfo() {
		const dummyInfo = []	;
		for (var i = 0; i < 20; i++) {

			dummyInfo.push(new Shift({
				isField: randBool(),
				position: Math.floor(Math.random() * 4),
				isOffering: randBool(),
				isOCP: randBool(),
				tradePreference: Math.floor(Math.random() * 3) - 1
			}));
		}

		return dummyInfo;
	}

	export default {
		components: {
			ShiftListItem
		}, data() {
			return {
				shifts: [],
				filters: {}
			}
		}, methods: {
			getShifts() {
				return new Promise((resolve) => {
					resolve(getDummyInfo());
				})
			},
			onPullToRefresh({object}) {
				this.$nextTick(() => {
					this.getShifts().then((newShifts) => {
						this.shifts = newShifts;
						object.notifyPullToRefreshFinished();
					})
				})
			}
		}, created() {
			this.getShifts().then((shifts) => {
				this.shifts = shifts;
			});
		}
	}
</script>

<style scoped>
</style>

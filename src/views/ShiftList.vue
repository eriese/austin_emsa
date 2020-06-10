<template web>
	<div>
		<ul>
			<li v-for="(shift, $index) in shifts" :key="$index">{{shift}}</li>
		</ul>
	</div>
</template>

<script>
	import ShiftList from './ShiftList.common';

	export default ShiftList.extend({});

</script>

<style scoped lang="scss">
.indicator-background {
	margin-top: 25;
	background-color: white;
	height: 40;
	width: 40;
	border-radius: 50%;
	padding: 5;
	z-index: 1;
	android-elevation: 4;

	ActivityIndicator {
		color: black;
	}
}
</style>

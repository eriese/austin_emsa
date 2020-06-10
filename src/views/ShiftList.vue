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
</style>

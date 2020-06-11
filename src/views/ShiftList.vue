<template web>
	<div>
		<ul>
			<ShiftListItem v-for="(shift, $index) in shifts" :key="$index" :shift="shift" />
		</ul>
	</div>
</template>

<script>
	import ShiftList from './ShiftList.common';

	export default ShiftList.extend({});

</script>

<style scoped lang="scss">
</style>

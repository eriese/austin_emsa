<template>
	<Page class="emsa-root" actionBarHidden="true">
		<ShiftForm class="emsa-page" v-if="currentPage == 0"/>
		<ShiftList class="emsa-page" v-if="currentPage == 1"/>
	</Page>
</template>

<script>
import ShiftForm from './ShiftForm';
import ShiftList from './ShiftList';

export default {
	components: {
		ShiftForm,
		ShiftList,
	},
	data() {
		return {
			currentPage: 1
		};
	}
}
</script>

<style>
</style>

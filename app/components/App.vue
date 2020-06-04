<template>
	<Page>
		<ScrollView class="emsa-root">
			<StackLayout class="emsa-inner">
				<ShiftForm />
			</StackLayout>
		</ScrollView>
	</Page>
</template>

<script>
import ShiftForm from './ShiftForm';

export default {
	components: {
		ShiftForm
	},
	data() {
		return {
		};
	}
}
</script>

<style>
.emsa-root {
	padding: 10;
}
</style>

<template native>
	<Button :text="'\uf104'" class="fas button cta--is-round pull-left button--is-back-button" @tap="onBackPressed"></Button>
</template>

<template web>
	<router-link :to="to" class="button cta--is-round cta--is-back fas fa-angle-left" aria-label="back"></router-link>
</template>

<script native>
import { android, AndroidApplication } from 'tns-core-modules/application'
import { isAndroid } from 'tns-core-modules/platform'

export default{
	props: {
		preventDefault: {
			type: Boolean,
			default: true
		}
	},
	methods: {
		onBackPressed(data) {
			if (this.preventDefault) {
				data.cancel = true // prevents default back button behavior
			}
			this.$emit('backPressed', data);
		}
	},
	mounted() {
		if (!isAndroid) { return }
		android.on(AndroidApplication.activityBackPressedEvent, this.onBackPressed);
	},
	destroyed() {
		if (!isAndroid) { return }
		android.off(AndroidApplication.activityBackPressedEvent, this.onBackPressed);
	}
};
</script>

<script web>
	export default {
		props: {
			to: {
				default: () => ({name: 'ShiftList'})
			}
		}
	}
</script>

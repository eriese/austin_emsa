import { android, AndroidApplication } from 'tns-core-modules/application'
import { isAndroid } from 'tns-core-modules/platform'

export default {
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
	},
	render: (h) => h('Label')
}

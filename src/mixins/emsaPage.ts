import Vue from 'vue';
import Store from '../services/Store';

export default Vue.extend({
	data() {
		return {
			store: Store
		}
	},
	mounted() {
		this.$nextTick(() => {
			this.$emit('pageMounted');
		})
	}
});

import Vue from 'vue';

export default Vue.extend({
	mounted() {
		this.$nextTick(() => {
			this.$emit('pageMounted');
		})
	}
});

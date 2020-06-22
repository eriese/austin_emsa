import Vue, {CreateElement, VueConstructor} from 'vue';
import CommonSetup from './main.common';
import App from './views/App.vue';

CommonSetup(Vue);

new Vue({
	methods: {
		openUrl() {}
	},
	render: (h: CreateElement) => h(<VueConstructor>App),
}).$mount('#app');

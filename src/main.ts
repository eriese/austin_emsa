import Vue, {CreateElement, VueConstructor} from 'vue';
import CommonSetup from './main.common';
import App from './views/App.vue';
import router from './router';
import VueRouter from 'vue-router';

CommonSetup(Vue);
Vue.use(VueRouter)

new Vue({
		methods: {
		openUrl() {}
	},

		router,
		render: (h: CreateElement) => h(<VueConstructor>App)
}).$mount('#app');

import Vue, {CreateElement, VueConstructor} from 'vue';
import CommonSetup from './main.common';
import App from './views/App.vue';
import router from './router';
import VueRouter from 'vue-router';
import * as ModalDialogs from 'vue-modal-dialogs';
import { Datetime } from 'vue-datetime';
import 'vue-datetime/dist/vue-datetime.css'

CommonSetup(Vue);
Vue.use(VueRouter);
Vue.use(ModalDialogs)
Vue.component('datetime', Datetime);

new Vue({
		methods: {
		openUrl() {}
	},

		router,
		render: (h: CreateElement) => h(<VueConstructor>App)
}).$mount('#app');

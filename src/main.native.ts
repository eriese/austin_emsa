import Vue from 'nativescript-vue';
import App from './views/App.vue';
import RadListView from 'nativescript-ui-listview/vue';
import { ModalStack, overrideModalViewMethod, VueWindowedModal } from 'nativescript-windowed-modal';
import VueFilterDateFormat from '@vuejs-community/vue-filter-date-format';
import BackButtonListener from './components/BackButtonListener';

// import VueDevtools from 'nativescript-vue-devtools';

Vue.use(RadListView);
Vue.use(VueFilterDateFormat);
Vue.registerElement('CheckBox', () => require('@nstudio/nativescript-checkbox').CheckBox, {
	model: {
		prop: 'checked',
		event: 'checkedChange'
	}
});

overrideModalViewMethod();
Vue.registerElement('ModalStack', () => ModalStack);
Vue.use(VueWindowedModal);

Vue.component('BackButtonListener', BackButtonListener);

const isProduction = process.env.NODE_ENV == 'production';
// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = isProduction;
// Vue.config.silent = true;
// if(!isProduction) {
// 	Vue.use(VueDevtools, {host: '192.168.1.9'});
// }

new Vue({
	render: h => h('frame', [h(App)])
}).$start()

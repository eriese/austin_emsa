import Vue from 'nativescript-vue'
import App from './views/App.vue'
import VueDevtools from 'nativescript-vue-devtools'
import RadDataForm from 'nativescript-ui-dataform/vue';
import RadListView from 'nativescript-ui-listview/vue';
import { ModalStack, overrideModalViewMethod, VueWindowedModal } from 'nativescript-windowed-modal';
import VueFilterDateFormat from '@vuejs-community/vue-filter-date-format';
import BackButtonListener from './components/BackButtonListener';

Vue.use(VueDevtools, {host: '192.168.1.9'})

Vue.use(RadDataForm);
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

if(process.NODE_ENV !== 'production') {
	Vue.use(VueDevtools)
}

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (process.NODE_ENV === 'production')
// Vue.config.silent = true;

new Vue({
	render: h => h('frame', [h(App)])
}).$start()

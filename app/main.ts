import Vue from 'nativescript-vue'
import App from './components/App.vue'
import VueDevtools from 'nativescript-vue-devtools'
import RadDataForm from 'nativescript-ui-dataform/vue';
import RadListView from 'nativescript-ui-listview/vue';
import VueFilterDateFormat from '@vuejs-community/vue-filter-date-format';

Vue.use(RadDataForm);
Vue.use(RadListView);
Vue.use(VueFilterDateFormat);

if(TNS_ENV !== 'production') {
	Vue.use(VueDevtools)
}


// Prints Vue logs when --env.production is *NOT* set while building
// Vue.config.silent = (TNS_ENV === 'production')
Vue.config.silent = true;


new Vue({

	render: h => h('frame', [h(App)])
}).$start()

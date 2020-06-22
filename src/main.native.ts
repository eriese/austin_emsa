import Vue from 'nativescript-vue';
import {PluginObject} from 'Vue';
import CommonSetup from './main.common';
import App from './views/App.vue';
import RadListView from 'nativescript-ui-listview/vue';
import { ModalStack, overrideModalViewMethod, VueWindowedModal } from 'nativescript-windowed-modal';
import VueFilterDateFormat from '@vuejs-community/vue-filter-date-format';
import BackButton from './components/BackButton.vue';
import CheckboxField from './components/CheckBoxField.vue';
import TitleAndBackButton from './components/TitleAndBackButton.vue';
import DateTimePicker from 'nativescript-datetimepicker/vue';
import PickerField from 'nativescript-picker/vue';

// import VueDevtools from 'nativescript-vue-devtools';

CommonSetup(Vue);
Vue.use(RadListView);
Vue.use(VueFilterDateFormat);
Vue.use(<PluginObject<any>>DateTimePicker);
Vue.use(PickerField);

overrideModalViewMethod();
Vue.registerElement('ModalStack', () => ModalStack);
Vue.use(VueWindowedModal);

Vue.registerElement('CheckBox', () => require('@nstudio/nativescript-checkbox').CheckBox, {
	model: {
		prop: 'checked',
		event: 'checkedChange'
	}
});

Vue.component('BackButton', BackButton);
Vue.component('CheckboxField', CheckboxField);
Vue.component('TitleAndBackButton', TitleAndBackButton);

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

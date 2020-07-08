import {VueConstructor} from 'vue';
import VueFilterDateFormat from '@vuejs-community/vue-filter-date-format';
import DateInput from './components/DateInput.vue';
import ModalContainer from './components/ModalContainer.vue';
import BackButton from './components/BackButton.vue';

export default function commonSetup(Vue: VueConstructor) {
	Vue.use(VueFilterDateFormat);
	Vue.component('DateInput', DateInput);
	Vue.component('ModalContainer', ModalContainer);
	Vue.component('BackButton', BackButton);
}

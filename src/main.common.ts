import {VueConstructor} from 'vue';
import VueFilterDateFormat from '@vuejs-community/vue-filter-date-format';

export default function commonSetup(Vue: VueConstructor) {
	Vue.use(VueFilterDateFormat);
}

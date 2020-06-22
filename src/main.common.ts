import {VueConstructor} from 'vue';
import VueFilterDateFormat from '@vuejs-community/vue-filter-date-format';
import {TNSFontIcon, fonticon} from 'nativescript-fonticon';



export default function commonSetup(Vue: VueConstructor) {
	TNSFontIcon.debug = true;
	TNSFontIcon.paths = {
		'fa': './assets/css/fontawesome/fontawesome.min/css',
		'fas': './assets/css/fontawesome/solid.min.css',
	};
	TNSFontIcon.loadCss();

	Vue.use(VueFilterDateFormat);
	Vue.filter('fonticon', fonticon);
}

import formatFixes from '../components/formatFixes';
import Vue from 'vue';

export default Vue.extend({
	methods: {
		fixEditorFormat(editorArgs: any) {
			formatFixes(editorArgs);
		}
	}
})

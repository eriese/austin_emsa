import formatFixes from '../components/formatFixes';
import Vue from 'vue';

export default Vue.mixin({
	methods: {
		fixEditorFormat(editorArgs: any) {
			// @ts-ignore: no undef
			formatFixes(editorArgs);
		}
	}
})

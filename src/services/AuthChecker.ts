import AuthChecker from './AuthChecker.common';

const checker: AuthChecker = {
	saveAuthToken() {},
	getAuthToken() {
		return '';
	},
	saveState() {},
	getState() {},
	logout() {
		// TODO this needs to be real
		return true;
	},
	isAuthed() {
		return true;
	}
}

export default checker;

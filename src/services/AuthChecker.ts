import AuthChecker from './AuthChecker.common';

const checker: AuthChecker = {
	saveAuthToken() {},
	getAuthToken() {
		return 'token';
	},
	clearAuthToken() {},
	saveState() {},
	getState() {},
	logout() {
		// TODO this needs to be real
	},
	isAuthed() {
		return true;
	}
}

export default checker;

import AuthChecker from './AuthChecker.common';

const checker: AuthChecker = {
	saveAuthToken() {},
	getAuthToken() {
		return 'token';
	},
	clearAuthToken() {},
	saveState() {},
	getState() {},
	logout() {},
	isAuthed() {
		return true;
	}
}

export default checker;

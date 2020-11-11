import AuthChecker from './AuthChecker.common';

const checker: AuthChecker = {
	clearAllOnFirstRun() {},
	saveAuthToken() {},
	getAuthToken() {
		return 'token';
	},
	saveState() {return true},
	getState() {
		return {};
	},
	logout() {
		return true;
	},
	isAuthed() {
		return true;
	}
}

export default checker;

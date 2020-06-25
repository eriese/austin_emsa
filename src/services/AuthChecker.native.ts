import {SecureStorage} from 'nativescript-secure-storage';
import AuthChecker, {authTokenName} from './AuthChecker.common';
import { ios } from "tns-core-modules/application";

declare const kSecAttrAccessibleWhenUnlockedThisDeviceOnly : string;
const storage = new SecureStorage(ios ? kSecAttrAccessibleWhenUnlockedThisDeviceOnly : undefined);
storage.clearAllOnFirstRunSync();

const checker: AuthChecker = {
	saveAuthToken(token: string) {
		return storage.set({key: authTokenName, value: token});
	},
	getAuthToken() {
		return storage.getSync({key: authTokenName});
	},
	clearAuthToken() {
		return storage.remove({key: authTokenName});
	},
	saveState(state: any) {
		return storage.set({key: 'state', value: JSON.stringify(state)});
	},
	getState() {
		return JSON.parse(storage.getSync({key: 'state'}) || '{"noState": true}');
	},
	logout() {
		return checker.clearAuthToken();
	}
}

export default checker;

import {SecureStorage} from 'nativescript-secure-storage';
import AuthChecker, {authTokenName} from './authChecker.common';
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
		console.log("prev state:", this.getState());
		return storage.set({key: 'state', value: JSON.stringify(state)});
	},
	getState() {
		return JSON.parse(storage.getSync({key: 'state'}) || '{"noState": true}');
	}
}

export default checker;

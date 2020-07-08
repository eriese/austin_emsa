import {SecureStorage} from 'nativescript-secure-storage';
import AuthChecker, {authTokenName} from './AuthChecker.common';
import { ios } from "tns-core-modules/application";

declare const kSecAttrAccessibleWhenUnlockedThisDeviceOnly : string;
const storage = new SecureStorage(ios ? kSecAttrAccessibleWhenUnlockedThisDeviceOnly : undefined);
storage.clearAllOnFirstRunSync();

const checker: AuthChecker = {
	saveAuthToken(token: string) {
		storage.set({key: authTokenName, value: token});
	},
	getAuthToken() {
		return storage.getSync({key: authTokenName});
	},
	saveState(state: any) {
		return storage.set({key: 'state', value: JSON.stringify(state)});
	},
	getState() {
		return JSON.parse(storage.getSync({key: 'state'}) || '{"noState": true}');
	},
	logout() {
		return storage.removeAllSync();
	},
	isAuthed() {
		console.log(this.getAuthToken());
		return this.getAuthToken() !== null;
	}
}

export default checker;

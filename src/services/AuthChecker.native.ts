import {SecureStorage} from 'nativescript-secure-storage';
import AuthChecker, {authTokenName} from './AuthChecker.common';
import { ios } from "tns-core-modules/application";

declare const kSecAttrAccessibleWhenUnlockedThisDeviceOnly : string;
const storage = new SecureStorage(ios ? kSecAttrAccessibleWhenUnlockedThisDeviceOnly : undefined);

const checker: AuthChecker = {
	clearAllOnFirstRun() {
		storage.clearAllOnFirstRun();
	},
	saveAuthToken(token: string) {
		storage.set({key: authTokenName, value: token});
	},
	getAuthToken() {
		return storage.getSync({key: authTokenName});
	},
	saveState(state: any) {
		return storage.setSync({key: 'state', value: JSON.stringify(state)})
	},
	getState() {
		const gotten = storage.getSync({key: 'state'})
		return JSON.parse(gotten || '{"noState": true}');
	},
	logout() {
		return storage.removeAllSync();
	},
	isAuthed() {
		return this.getAuthToken() !== null;
	}
}

export default checker;

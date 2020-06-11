import {SecureStorage} from 'nativescript-secure-storage';
import AuthChecker, {authTokenName} from './authChecker.common';
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
	}
}

export default checker;

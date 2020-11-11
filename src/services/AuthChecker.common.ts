export const authTokenName: string = 'authToken';
import {AxiosResponse} from 'axios';

export default interface AuthChecker {
	clearAllOnFirstRun() : void;
	saveAuthToken(token: string): void;
	getAuthToken() : string;
	saveState(state: any):boolean;
	getState() : object;
	logout():  boolean;
	isAuthed() : boolean;
}

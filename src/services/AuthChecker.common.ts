export const authTokenName: string = 'authToken';
import {AxiosResponse} from 'axios';

export default interface AuthChecker {
	saveAuthToken(token: string);
	getAuthToken() : string;
	clearAuthToken();
	saveState(state: any);
	getState() : any;
	logout():  boolean;
	isAuthed() : boolean;
}

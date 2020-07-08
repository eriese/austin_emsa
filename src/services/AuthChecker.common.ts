export const authTokenName: string = 'authToken';
import {AxiosResponse} from 'axios';

export default interface AuthChecker {
	saveAuthToken(token: string): void;
	getAuthToken() : string;
	saveState(state: any): void;
	getState() : any;
	logout():  boolean;
	isAuthed() : boolean;
}

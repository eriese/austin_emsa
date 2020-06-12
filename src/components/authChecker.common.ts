export const authTokenName: string = 'authToken';
import {AxiosResponse} from 'axios';

export default interface AuthChecker {
	saveAuthToken: Function,
	getAuthToken: Function,
	clearAuthToken: Function
}

export const authTokenName: string = 'authToken';
import {AxiosResponse} from 'axios';

export default interface {
	saveAuthToken: Function,
	getAuthToken: Function
}

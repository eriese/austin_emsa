import axios, {AxiosError} from 'axios';

import {JsonSnakeToCamel, JsonCamelToSnake} from '../utils';
import Shift, {ShiftFilterSet} from './Shift';
import AuthChecker from './authChecker';

// const baseURL = 'http://back.austin_emsa.org:3000';
const baseURL = ' https://cryptic-brook-18592.herokuapp.com';

const api = axios.create({
	baseURL,
	withCredentials: true,
});

let access_token: string;
let refresh_token: string;

function getAuthHeaders(token?: string) {
	return {
		Authorization: `Bearer ${token || AuthChecker.getAuthToken()}`
	};
}

function handleError(rejector?: Function) {
	return (error: AxiosError) => {
		console.log(error);
		if (typeof rejector == 'function') {
			rejector(error)
		}
	}
}
const ApiService = {
	signup(user: {email: string, password: string, password_confirmation: string}, callback?: Function) {
		return new Promise((resolve, reject) => {
			api.post('/signup', {
				user
			}).then(() => {
				ApiService.login(user, () => {
					callback && callback();
					resolve();
				}).catch(handleError(reject));
			}).catch(handleError(reject))
		})
	},
	login(user : {email: string, password: string}, callback?: Function) {
		return new Promise((resolve, reject) => {
			api.post('/oauth/token', {
				...user,
				grant_type: 'password'
			}).then(response => {
				access_token = response.data.access_token;
				refresh_token = response.data.refresh_token;
				AuthChecker.saveAuthToken(access_token);
				callback && callback();
				resolve();
			}).catch(handleError(reject))
		})
	},
	getShifts(filters: ShiftFilterSet, callback?: Function, onError?: Function) {
		return api.get('/shifts', {
			params: JsonCamelToSnake(filters),
			headers: getAuthHeaders(),
		}).then((response) => {
			const convertedList = JsonSnakeToCamel(response.data).sort((a: Shift, b: Shift) => {
				let diff: number = new Date(a.shiftDate).getTime() - new Date(b.shiftDate).getTime();
				if (diff == 0) {
					diff = new Date(a.shiftStart).getTime() - new Date(b.shiftStart).getTime();
				}

				return diff;
			});

			callback && callback(convertedList);
		}).catch(error => {
			console.log(error);
			onError && onError(error);
		})
	},
	submitShift(shift: Shift) {
		return api.post('/shifts', {
			shift: JsonCamelToSnake(shift),
		}, {
			headers: getAuthHeaders()
		})
	},
	deleteShift(shift: Shift) {
		return api.delete(`/shifts/${shift.id}`, {
			headers: getAuthHeaders()
		})
	}
};

export default ApiService;

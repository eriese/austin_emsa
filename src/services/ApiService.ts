import axios, {AxiosError, AxiosResponse} from 'axios';

import {snakeToCamel, camelToSnake, JsonSnakeToCamel} from '../utils';
import Shift from '../models/Shift';
import ShiftFilterSet from '../models/ShiftFilterSet';
import AuthChecker from './AuthChecker';
import {dateFormat} from '@vuejs-community/vue-filter-date-format';
import Qs from 'qs';

let baseURL = process.env.VUE_APP_API_URL || 'https://emsa-shift-request-backend.herokuapp.com';

function serializeDate(d: Date) {
	const zone = d.getTimezoneOffset() / 60;
	const offsetMarker = zone < 0 ? '+' : '-';
	return `${dateFormat(d, 'YYYY-MM-DDTHH:mm:ss')}${offsetMarker}${Math.abs(zone)}00`
}

function paramsSerializer(params: object) {
	return Qs.stringify(params, {
		arrayFormat: 'brackets',
		serializeDate
	})
}

const api = axios.create({
	baseURL,
	withCredentials: true,
	transformRequest:[paramsSerializer],
	paramsSerializer
});

api.defaults.headers['Api-Version'] = 'v2';

let access_token: string;
// let refresh_token: string;

function getAuthHeaders(token?: string) {
	if (process.env.VUE_APP_MODE == 'web') {
		return {};
	}

	return {
		Authorization: `Bearer ${token || AuthChecker.getAuthToken()}`
	};
}

function handleError(rejector?: Function) {
	return (error: AxiosError) => {
		console.log(JSON.stringify(error));
		if (typeof rejector == 'function') {
			rejector(error)
		}
	}
}
const ApiService = {
	signup(user: {email: string, password: string, password_confirmation: string}) {
		return new Promise((resolve, reject) => {
			api.post('/signup', { user })
				.then(resolve)
				.catch(handleError(reject))
		})
	},
	login(user : {email: string, password: string}) {
		return new Promise((resolve, reject) => {
			api.post('/oauth/token', {
				...user,
				grant_type: 'password',
				scope: process.env.VUE_APP_MODE
			}).then(ApiService.onLogin(resolve)).catch(handleError(reject))
		})
	},
	onLogin(resolve: Function) {
		return (response: AxiosResponse) => {
			access_token = response.data.access_token;
			// refresh_token = response.data.refresh_token;
			AuthChecker.saveAuthToken(access_token);
			resolve();
		}
	},
	logout() {
		return api.post('/oauth/revoke');
	},
	getConfig() {
		return api.get('/shifts/config', {headers: getAuthHeaders()});
	},
	getShifts(filters: ShiftFilterSet, callback?: Function, onError?: Function) {
		return api.get('/shifts', {
			params: filters,
			headers: getAuthHeaders(),
		}).then((response) => {
			const convertedList = response.data.sort((a: Shift, b: Shift) => {
				let diff: number = new Date(a.shift_date).getTime() - new Date(b.shift_date).getTime();
				if (diff == 0) {
					diff = new Date(a.shift_start).getTime() - new Date(b.shift_start).getTime();
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
			shift,
		}, {
			headers: getAuthHeaders()
		})
	},
	getShift(shiftID: number) {
		return new Promise((resolve, reject) => {
			api.get(`/shifts/${shiftID}`).then((response) => {
				resolve(response.data);
			}).catch(reject);
		});
	},
	deleteShift(shift: Shift) {
		return api.delete(`/shifts/${shift.id}`, {
			headers: getAuthHeaders()
		})
	},
	getSpreadsheet(sheetName: string) {
		return new Promise((resolve, reject) => {
			api.get(`/${sheetName}`, {
				headers: getAuthHeaders()
			}).then((response) => resolve(response.data));
		})
	},
	testToken(): Promise<false|AxiosResponse> {
		return new Promise((resolve) => {
			const token = AuthChecker.getAuthToken();
			if (!token) {resolve(false);}

			api.get('/oauth/token/info', {
				headers: getAuthHeaders()
			}).then((response) => resolve(response)).catch(() => resolve(false));
		});
	},
	getAdminData(allUsers: boolean | undefined) {
		return api.get('/users', {
			params: {all: allUsers}
		})
	},
	adminPost(propToSet: string, userIDs: number[]) {
		return api.post(`/bulk_${propToSet}`, {
			user_ids: userIDs
		})
	},
	getCodesCount() {
		return new Promise((resolve, reject) => {
			api.get('/codes/count').then((response) => {
				resolve(response.data)
			}).catch(reject);
		});
	},
	submitCodes(codeList: string[]) {
		return api.post('/codes/upload', {
			codes: codeList
		})
	},
	getUserCodes(){
		return api.get('/codes');
	},
	requestCode() {
		return api.post('/codes');
	},
	requestReset(user: {email: string}) {
		return api.post('/password', {user});
	},
	submitReset(user: {password: string, password_confirmation: string}) {
		return new Promise((resolve, reject) => {
			api.put('/password', { user })
				.then(resolve)
				.catch(handleError(reject))
		});
	},
	requestConfirmation(user: {email: string}) {
		return api.post('/confirmation', {user});
	},
	submitConfirmation(code : string) {
		return new Promise((resolve, reject) => {
			api.get(`/confirmation?confirmation_token=${code}&scope=${process.env.VUE_APP_MODE}`)
				.then(ApiService.onLogin(resolve))
				.catch(handleError(reject))
		})
	}
};

export default ApiService;

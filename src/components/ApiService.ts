import axios from 'axios';
import {JsonSnakeToCamel, JsonCamelToSnake} from '../utils';
import Shift, {ShiftFilterSet} from './Shift';
import AuthChecker from './authChecker';

const baseURL = 'http://back.austin_emsa.org:3000';
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

export default {
	login(user : {email: string, password: string}, callback?: Function) {
		return api.post('/oauth/token', {
			...user,
			grant_type: 'password'
		}).then(response => {
			access_token = response.data.access_token;
			refresh_token = response.data.refresh_token;
			AuthChecker.saveAuthToken(access_token);
			callback && callback();
		}).catch(error => {
			console.log(error);
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
			onError && onError();
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

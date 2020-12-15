import Shift, {IShift} from '../models/Shift';
import ShiftFilterSet from '../models/ShiftFilterSet';
import ApiService from './ApiService';
import AuthChecker from './AuthChecker';
import {AxiosError, AxiosResponse} from 'axios';
import ShiftViewModel from '../models/ShiftViewModel';

class Store {
	state: {
		selectedShift: Shift | null,
		scrollIndex: number,
		loginIndex: number
		currentList: Shift[],
		currentFilters: ShiftFilterSet,
		userList: Shift[],
		currentPage?: string,
		prevPage?: string,
		isAuthed: boolean | null,
		isAdmin: boolean,
		config: object
	};

	onListSuccess?: Function;
	onListError?: Function;
	saveStateMethod?: Function;

	constructor() {
		this.state = {
			selectedShift: null,
			scrollIndex: 0,
			currentList: [],
			userList: [],
			loginIndex: 0,
			currentFilters: new ShiftFilterSet(),
			isAuthed: null,
			isAdmin: false,
			config: {}
		}

		if (process.env.VUE_APP_MODE == 'native') {
			this.state.currentPage = undefined;
			this.state.prevPage = undefined;
		}
	}
	get selectedShift() : Shift | null {
		return this.state.selectedShift;
	}

	set selectedShift(selectedShift: Shift | null) {
		this.state.selectedShift = selectedShift ? new Shift(selectedShift) : null;
		this.saveState();
	}

	get scrollIndex() : number {
		return this.state.scrollIndex;
	}

	set scrollIndex(index: number) {
		this.state.scrollIndex = index;
		this.saveState();
	}

	get currentList() : Shift[] {
		return this.state.currentList;
	}

	set currentList(list: Shift[]) {
		list = list.map((s: IShift) => new Shift(s));
		this.state.currentList = list.sort((a: Shift, b: Shift) => {
			let diff = a.shift_date.valueOf() - b.shift_date.valueOf();
			if (diff == 0) {
				diff = a.shift_start.valueOf() - b.shift_start.valueOf();
			}

			return diff;
		});

		this.saveState();
	}

	get currentFilters() : ShiftFilterSet {
		return this.state.currentFilters;
	}

	set currentFilters(filters: ShiftFilterSet) {
		if (!filters || this.currentFilters.equals(filters)) {return;}

		this.state.currentFilters = filters;
		this.saveState();
	}

	get userList() {
		return this.state.userList;
	}

	set userList(list: Shift[]) {
		this.state.userList = list;
	}

	get loginIndex() {
		return this.state.loginIndex;
	}

	set loginIndex(index: number) {
		this.state.loginIndex = index;
		this.saveState();
	}

	get isAuthed() {
		return this.state.isAuthed;
	}

	set isAuthed(authed: boolean | null) {
		this.state.isAuthed = authed;
		this.saveState();
	}

	get isAdmin() { return this.state.isAdmin; }

	async testToken() {
		// TODO somehow this isn't always getting set properly
		const tokenReponse : boolean | AxiosResponse = await ApiService.testToken();
		if (tokenReponse === false) {
			this.isAuthed = false;
		} else {
			this.state.isAuthed = true;
			this.state.isAdmin = tokenReponse.data.admin;
			this.saveState();
		}

		return this.isAuthed;
	}

	async getConfig() {
		try {
			const configResponse : AxiosResponse = await ApiService.getConfig();
			this.state.config = configResponse.data.config;
			ShiftViewModel.setFieldConfig(configResponse.data.fields);
			this.saveState();
			return true;
		} catch (e) {
			console.log(e);
			return false;
		}
	}

	logout() {
		return new Promise((resolve) => {
			ApiService.logout().then(() => {
				AuthChecker.logout();
				this.state.isAuthed = false;
				this.clearState();
				resolve(true);
			}).catch((error) => {
				console.log(error);
				resolve(false);
			});
		})
	}

	saveState() {
		return this.saveStateMethod && this.saveStateMethod();
	}

	reviveState(state: any) {
		if (!state || state.noState) { state = {}; }
		Object.assign(this.state, state);
		this.state.currentFilters = new ShiftFilterSet(state.currentFilters);
	}

	loadList(callback?: Function) {
		return ApiService.getShifts(this.state.currentFilters, (newList: Shift[]) => {
			this.currentList = newList;

			this.onListSuccess && this.onListSuccess()
			if (typeof callback == 'function') {
				callback();
			}
		}, (error: AxiosError) => {
			if (error.response && this.onListError && [401, 403].includes(error.response.status)) {
				this.onListError(error);
			}
		});
	}

	clearState() {
		this.state.selectedShift = null;
		this.state.scrollIndex = 0;
		this.state.currentList = [];
		this.state.currentFilters = new ShiftFilterSet();
		this.saveState();
	}
}

const store = new Store();
export default store;

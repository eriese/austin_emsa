import Shift, {ShiftFilterSet, IShift} from '../models/Shift';
import ApiService from './ApiService';
import {AxiosError} from 'axios';

class Store {
	state: {
		selectedShift: Shift | null,
		scrollIndex: number,
		loginIndex: number
		currentList: Shift[],
		currentFilters: ShiftFilterSet,
		currentPage?: string,
		prevPage?: string
	};

	onListSuccess?: Function;
	onListError?: Function;
	saveStateMethod?: Function;

	constructor() {
		this.state = {
			selectedShift: null,
			scrollIndex: 0,
			currentList: [],
			loginIndex: 0,
			currentFilters: new ShiftFilterSet(),
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
		this.state.selectedShift = selectedShift;
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
		list.map((s: IShift) => new Shift(s));
		this.state.currentList = list.sort((a: Shift, b: Shift) => {
			let diff = a.shiftDate.valueOf() - b.shiftDate.valueOf();
			if (diff == 0) {
				diff = a.shiftStart.valueOf() - b.shiftStart.valueOf();
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

	get loginIndex() {
		return this.state.loginIndex;
	}

	set loginIndex(index: number) {
		this.state.loginIndex = index;
		this.saveState();
	}

	saveState() {
		this.saveStateMethod && this.saveStateMethod();
	}

	reviveState(state: any) {
		if (!state || state.noState) { return; }
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
			if (error.response && error.response.status == 401 && this.onListError) {
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

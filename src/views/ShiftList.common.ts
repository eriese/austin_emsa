import Vue from 'vue';
import Shift, {ShiftFilterSet} from '../components/Shift';
import ShiftListItem from '../components/ShiftListItem.vue';
import emsaPage from '../mixins/emsaPage';

export default Vue.extend({
	name: 'ShiftList',
	mixins: [emsaPage],
	components: {
		ShiftListItem
	},
	props: {
		shifts: {
			type: Array,
			default: (): Shift[] => []
		},
		filters: Object,
		scrollIndex: Number
	},
	data() {
		return {
			dataIsLoading: false
		}
	},
	methods: {
		getShifts(filters: ShiftFilterSet, showLoader: boolean = true, callback?: Function | undefined) {
			this.dataIsLoading = showLoader;
			this.$emit('listRequested', filters, () => {
				this.dataIsLoading = false;

				if (typeof callback == 'function') {
					callback();
				}
			})
		},
		onPullToRefresh(eventObject: any) {
			this.$nextTick(() => {
				this.getShifts(this.filters, false, () => this.notifyPullToRefreshFinished(eventObject));
			})
		},
		showFiltersModal: async function() {
			const oldFilterState: string = JSON.stringify(this.filters);
			const newFilters: ShiftFilterSet = JSON.parse(oldFilterState);
			const options = {
				props: {
					filters: newFilters
				}
			};

			await this.showModal(options);

			const newFilterState = JSON.stringify(newFilters);
			if (newFilterState != oldFilterState) {
				this.getShifts(newFilters);
			}
		},
		showShift(index: number) {
			this.$emit('shiftSelected', index);
		},
		showModal(options: { props: any}): Promise<void> {
			return new Promise((resolve) => resolve());
		},
		notifyPullToRefreshFinished(eventObject: any) {

		},
		scrollListToIndex(index: number) {}
	},
	mounted() {
		this.$nextTick(() => {
			this.scrollListToIndex(this.scrollIndex);
		})
	}
});

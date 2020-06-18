import Vue from 'vue';
import Shift, {ShiftFilterSet} from '../components/Shift';
import ShiftListItem from '../components/ShiftListItem.vue';
import emsaPage from '../mixins/emsaPage';

export default Vue.extend({
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
		scrollIndex: Number,
		useFilters: Boolean,
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
			const options = {
				props: {
					filters: this.filters
				}
			};

			const filterResults = await this.showModal(options);
			if (!filterResults) { return; }

			const newFilterState = JSON.stringify(filterResults);
			if (newFilterState != oldFilterState) {
				this.getShifts(filterResults);
			}
		},
		showShift(index: number) {
			this.$emit('shiftSelected', index);
		},
		showModal(options: { props: any}): Promise<ShiftFilterSet | undefined> {
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

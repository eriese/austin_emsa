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
				this.getShifts(this.store.currentFilters, false, () => this.notifyPullToRefreshFinished(eventObject));
			})
		},
		showFiltersModal: async function() {
			const options = {
				props: {
					filters: this.store.currentFilters
				}
			};

			const filterResults = await this.showModal(options);
			if (!filterResults || this.store.currentFilters.equals(filterResults)) { return; }

			this.getShifts(filterResults);
		},
		showModal(options: { props: any}): Promise<ShiftFilterSet | undefined> {
			return new Promise((resolve) => resolve());
		},
		notifyPullToRefreshFinished(eventObject: any) {},
		scrollListToIndex(index: number) {},
		onScroll(scrollIndex) {
			this.store.scrollIndex = scrollIndex;
		}
	},
	mounted() {
		this.$nextTick(() => {
			this.scrollListToIndex(this.store.scrollIndex);
		})
	}
});

import Shift, {ShiftFilterSet} from '../models/Shift';
import ShiftListItem from '../components/ShiftListItem.vue';
import EmsaPage from '../mixins/EmsaPage';

export default EmsaPage.extend({
	name: 'ShiftList',
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
			this.store.currentFilters = filters;
			this.store.loadList(() => {
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
			if (!filterResults || this.store.currentFilters.equals(filterResults)) {
				return;
			}

			this.getShifts(filterResults);
			this.onNewFilters(filterResults);
		},
		showModal(options: { props: any}): Promise<ShiftFilterSet | undefined> {
			return new Promise((resolve) => resolve());
		},
		onNewFilters(newFilters) {},
		notifyPullToRefreshFinished(eventObject: any) {},
		scrollListToIndex(index: number) {},
		onScroll(scrollIndex: number) {
			this.store.scrollIndex = scrollIndex;
		}
	},
	mounted() {
		if (this.store.currentList.length === 0) {
			this.getShifts(this.store.currentFilters, true, () => {
				this.scrollListToIndex(this.store.scrollIndex);
			});
		}
		else {
			this.$nextTick(() => {
				this.scrollListToIndex(this.store.scrollIndex);
			})
		}
	}
});

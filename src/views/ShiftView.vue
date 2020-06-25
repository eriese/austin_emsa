<template native>
	<ScrollView>
		<StackLayout>
			<TitleAndBackButton @backPressed="goBack" :text="`${this.valueLabels.isOffering} Shift`"/>
			<Label :text="this.valueLabels.dates" class="h2 text-center"/>
			<GridLayout columns="*,auto" :rows="rowSpec" class="shift-view">
				<Label v-for="(field, $index) in listedFields" :text="fieldLabels[field]" :row="$index" col="0" :key="`field_${field}`" class="shift-view__label"/>
				<Label v-for="(field, $index) in listedFields" :text="valueLabels[field]" :row="$index" col="1" :key="`value_${field}`" class="shift-view__value"/>
			</GridLayout>
			<Button v-if="displayedShift.isUser" text="Delete This Post" @tap="deletePost" class="button cta" horizontalAlignment="center" />
			<Button v-else text="Email This Poster" @tap="openEmail" class="button cta" horizontalAlignment="center"/>
		</StackLayout>
	</ScrollView>
</template>

<template web>
	<h1>Shift View</h1>
</template>

<script>
import ShiftDisplay from '../mixins/ShiftDisplay';
import Shift from '../models/Shift';
import EmsaPage from '../mixins/EmsaPage';
import ApiService from '../services/ApiService';
import Store from '../services/Store';


const excludedFields = /(id|shiftDate|shiftStart|shiftEnd|email)/
const displayFields = Object.getOwnPropertyNames(new Shift()).filter((p) => !p.match(excludedFields));

export default {
	name: 'ShiftView',
	mixins: [ShiftDisplay, EmsaPage],
	data() {
		return {
			displayFields,
			listedFields: [],
			rowSpec: [],
			fieldLabels: {},
		}
	},
	computed: {
		displayedShift() {
			return this.store.selectedShift;
		}
	},
	methods: {
		goBack() {
			this.$emit('back');
		},
		openEmail() {
			this.openUrl(`mailto:${this.displayedShift.email}`);
		},
		deletePost() {
			ApiService.deleteShift(this.displayedShift).then(() => {
				alert('Successfully deleted!').then(() => {
					this.$emit('back');
				});
			}).catch((error) => {
				console.log(error);
			})
		}
	},
	beforeRouteEnter(toRoute, fromRoute, next) {
		const list = toRoute.meta.isUser ? Store.userList : Store.currentList;

		if (!list.length) {
			ApiService.getShift(toRoute.params.id).then((shift) => {
				Store.selectedShift = new Shift(shift);
				next();
			}).catch(() => next(fromRoute || {name: 'ShiftList'}));
		} else {
			const foundShift = list.find((s) => s.id == toRoute.params.id);
			Store.selectedShift = foundShift;
			next();
		}
	},
	beforeRouteLeave(toRoute, fromRoute, next) {
		Store.selectedShift = null;
		next();
	},
	created() {
		for (var i = 0; i < displayFields.length; i++) {
			let field = displayFields[i];
			if (field == 'isOffering') { continue; }

			let fieldLabel = this.viewModel.getFieldFilterName(field);
			if (!fieldLabel) {continue;}

			this.listedFields.push(field);
			this.fieldLabels[field] = fieldLabel;
			this.rowSpec.push('auto');
		}
	}
}
</script>

<style scoped lang="scss">
.shift-view {
	padding: 20;

	&__label, &__value {
		font-size: 16;
		border-bottom-width: 1;
		border-bottom-color: var(--highlight);
		margin-bottom: 15;
	}

	&__value {
		color: var(--highlight);
	}
}
</style>

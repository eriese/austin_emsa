<template native>
	<ScrollView>
		<StackLayout>
			<TitleAndBackButton @backPressed="goBack" :text="`${valueLabels.is_offering} Shift`"/>
			<Label :text="valueLabels.date" class="h2 text-center"/>
			<Label :text="valueLabels.time" class="h2 text-center"/>
			<GridLayout columns="*,auto" :rows="rowSpec" class="shift-view">
				<Label v-for="(field, $index) in listedFields" :text="fieldLabels[field]" :row="$index" col="0" :key="`field_${field}`" class="shift-view__label" textWrap="true"/>
				<Label v-for="(field, $index) in listedFields" :text="valueLabels[field]" :row="$index" col="1" :key="`value_${field}`" class="shift-view__value" textWrap="true"/>
			</GridLayout>
			<Button v-if="displayedShift.isUser" text="Delete This Post" @tap="deletePost" class="button cta" horizontalAlignment="center" />
			<Button v-else text="Email This Poster" @tap="openEmail" class="button cta" horizontalAlignment="center"/>
		</StackLayout>
	</ScrollView>
</template>

<template web>
	<div class="side-padded">
		<back-button :to="backPage" />
		<h1 class="h1 text-center">{{valueLabels.is_offering}} Shift</h1>
		<h2 class="h2 text-center">{{valueLabels.date}}</h2>
		<h2 class="h2 text-center">{{valueLabels.time}}</h2>
		<table class="shift-view">
			<tr v-for="field in listedFields" :key="field">
				<td class="shift-view__label">{{fieldLabels[field]}}</td>
				<td class="shift-view__value">{{valueLabels[field]}}</td>
			</tr>
		</table>

		<div class="text-center">
			<button v-if="displayedShift.isUser" class="button cta" @click="deletePost">Delete This Post</button>
			<a v-else class="button cta" :href="shiftEmail" target="_blank">Email This Poster</a>
		</div>
	</div>
</template>

<script>
import ShiftDisplay from '../mixins/ShiftDisplay';
import Shift from '../models/Shift';
import EmsaPage from '../mixins/EmsaPage';
import ApiService from '../services/ApiService';
import Store from '../services/Store';
import ShiftViewModel from '../models/ShiftViewModel';

const excludedFields = /(shift_date|shift_start|shift_end)/

export default {
	name: 'ShiftView',
	mixins: [ShiftDisplay, EmsaPage],
	data() {
		return {
			displayFields: ShiftViewModel.annotatedFields.filter((p) => !p.match(excludedFields)),
			listedFields: [],
			rowSpec: [],
			fieldLabels: {},
		}
	},
	computed: {
		givenShift() {
			return this.store.selectedShift;
		},
		shiftEmail() {
			if (this.displayedShift.isUser) {return '';}
			const subject = `${this.valueLabels.position} ${this.valueLabels.isField} ${this.valueLabels.isOcp} on ${this.dateString.split(', ')[1]}`;
			return `mailto:${this.displayedShift.email}?subject=${encodeURI(subject)}&body=%0A%0A${encodeURI(this.store.state.config.email_warning)}`
		},
		backPage() {
			return {name: this.displayedShift.isUser ? 'UserView' : 'ShiftList'}
		}
	},
	methods: {
		goBack() {
			this.$emit('back');
		},
		openEmail() {
			this.$root.openUrl(this.shiftEmail);
		},
		deletePost() {
			ApiService.deleteShift(this.displayedShift).then(async () => {
				await alert('Successfully deleted!')

				if (this.$router) {
					this.$router.push(this.backPage);
				} else {
					this.$emit('back');
				}
			}).catch((error) => {
				console.log(error);
			})
		}
	},
	beforeRouteEnter: async function(toRoute, fromRoute, next) {
		const isUser = toRoute.meta.isUser;
		const list = isUser ? Store.userList : Store.currentList;
		let foundShift;

		try {
			if (list.length) {
				foundShift = list.find((s) => s.id == toRoute.params.id);
			} else {
				const rawShift = await ApiService.getShift(toRoute.params.id);
				foundShift = new Shift(rawShift);
			}

			foundShift.isUser = isUser;
			Store.selectedShift = foundShift;
			next();
		} catch {
			const backPath = fromRoute.name ? fromRoute :
				{name: isUser ? 'UserView' : 'ShiftList'};
			next(backPath);
			return;
		}
	},
	beforeRouteLeave(toRoute, fromRoute, next) {
		Store.selectedShift = null;
		next();
	},
	created() {
		for (var i = 0; i < this.displayFields.length; i++) {
			let field = this.displayFields[i];
			if (field == 'is_offering') { continue; }

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
	margin: 1rem auto;
	min-width: 300px;

	&__label, &__value {
		font-size: 1rem;
		font-size: 16;
		border-bottom: 1px solid;
		border-bottom-width: 1;
		border-bottom-color: var(--highlight);
		padding-top: 1rem;
		padding-top: 15;
	}

	&__value {
		color: var(--highlight);
	}
}
</style>

<template native>
	<ScrollView>
		<StackLayout class="form">
			<TitleAndBackButton @backPressed="$emit('back')" text="List a Shift"/>
			<Stacklayout v-for="f in fields" :key="f.fieldName" class="form-field">
				<Label :text="f.label" class="form-field__label" textWrap="true"/>
				<TextField v-if="f.inputType == 'text' || f.inputType == 'textarea'" v-model="shift[f.fieldName]"  class="form-field__input"/>
				<WrapLayout v-else-if="f.inputType == 'radio'" class="form-field__input">
					<CheckboxField v-for="(v, i) in f.values" :key="v.label" :class="[i == f.value ? 'form-field__input--is-selected' : 'form-field__input--is-unselected']" @checkedChange="shift[f.fieldName] = v.value" :checked="v.value == shift[f.fieldName]" :text="v.label" boxType="circle" :radio="true"/>
				</WrapLayout>
				<DateInput v-else :type="f.inputType" v-model="shift[f.fieldName]"/>
			</Stacklayout>
			<Button text="Save" @tap="submitForm" class="button" />
		</StackLayout>
	</ScrollView>
</template>

<template web>
	<div class="side-padded">
		<back-button/>
		<h1 class="h1 text-center">List a Shift</h1>
		<form novalidate @submit="submitForm" class="form">
			<div class="form-field" v-for="f in fields" :key="f.fieldName">
				<label class="form-field__label" :for="f.fieldName">{{f.label}}</label>
				<div v-if="f.inputType == 'radio'" role="radiogroup">
					<span v-for="v in f.values">
						<input type="radio" :value="v.value" v-model="shift[f.fieldName]" :id="`${f.fieldName}-${v}`" >
						<label :for="`${f.fieldName}-${v}`">{{v.label}}</label>
					</span>
				</div>
				<div v-else>
					<date-input v-model="shift[f.fieldName]" :type="f.inputType" v-if="f.inputType == 'date' || f.inputType == 'time'"/>
					<input v-else :type="f.inputType" :id="f.fieldName" v-model="shift[f.fieldName]">
				</div>
			</div>
			<div class="text-center">
				<input type="submit" class="button">
			</div>
		</form>
	</div>
</template>


<script>
	import Shift from '../models/Shift';
	import ShiftViewModel from '../models/ShiftViewModel';
	import ApiService from '../services/ApiService';
	import EmsaPage from '../mixins/EmsaPage';

	export default {
		name: 'ShiftForm',
		mixins: [EmsaPage],
		data() {
			const shift = new Shift();
			const valueManager = {};
			const viewModel = new ShiftViewModel(shift);

			viewModel.annotatedFields.forEach((f) => {
				const inputType = viewModel.getFieldInputType(f)
				valueManager[f] = {inputType};

				const valueLabels = viewModel.getFieldValueLabels(f);
				if (valueLabels) {
					const converter = viewModel.getFieldValueConverter(f)
					valueManager[f].values = valueLabels.map((v) => {
						return {
							label: v,
							value: converter ? converter.convertTo(v) : v
						}
					})
				}
			});

			return {
				shift,
				valueManager,
				viewModel,
			};
		},
		computed: {
			fields() {
				const fields = []
				for (var f in this.shift) {
					let label =  this.viewModel.getFieldLabel(f);

					if (!label) { continue; }

					let fieldManager = this.valueManager[f] || {};

					fields.push({
						label,
						inputType: fieldManager.inputType,
						values: fieldManager.values,
						fieldName: f,
					});
				}
				return fields;
			},
		},
		methods: {
			submitForm(e) {
				e.preventDefault && e.preventDefault();
				console.log('submitting shift: ', this.shift);
				ApiService.submitShift(this.shift).then(async () => {
					await alert('Successfully saved!');
					this.$emit('back');
				}).catch((error) => {
					console.log(error);
				})
			},
		},
	};
</script>

<style scoped>

</style>

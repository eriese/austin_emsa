<template native>
	<ScrollView>
		<StackLayout class="form">
			<TitleAndBackButton @backPressed="$emit('back')" text="List a Shift"/>
			<Stacklayout v-for="f in fields" :key="f.fieldName" class="form-field">
				<Label :text="f.label" class="form-field__label" textWrap="true"/>
				<TextField v-if="f.inputType == 'text' || f.inputType == 'textarea'" v-model="shift[f.fieldName]"  class="form-field__input"/>
				<WrapLayout v-else-if="f.inputType == 'radio'" class="form-field__input">
					<CheckboxField v-for="(v, i) in f.values" :key="v.label" :class="[i == f.value ? 'form-field__input--is-selected' : 'form-field__input--is-unselected']" @checkedChange="shift[f.fieldName] = v.value" :checked="v.value == shift[f.fieldName]" :text="v.label" boxType="circle"/>
				</WrapLayout>
				<DatePickerField v-else-if="f.inputType == 'date'" :date="shift[f.fieldName]" dateFormat="EEEE M/d/yy" @dateChange="onDateTimeSelected($event, f.fieldName)" :ref="f.fieldName" />
				<TimePickerField v-else-if="f.inputType == 'time'" :time="shift[f.fieldName]" timeFormat="h:mm a" @timeChange="onDateTimeSelected($event, f.fieldName)" :ref="f.fieldName" />
			</Stacklayout>
			<Button text="Save" @tap="submitForm" class="button" />
		</StackLayout>
	</ScrollView>
</template>

<template web>
	<div>
		<router-link :to="{name: 'ShiftList'}" class="button cta--is-round">Back</router-link>
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
					<input v-if="f.inputType == 'date' || f.inputType == 'time'" :type="f.inputType" :value="f.mask" @input="f.listener">
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
				const fieldManager = {inputType};


				if (inputType == 'date') {
					fieldManager.listener = ($event) => {
							this.shift[f] = new Date($event.target.value);
						}
				} else if (inputType == 'time') {
					fieldManager.listener = ($event) => {
						const newDate = new Date(this.shift.shiftDate);
						const hourSet = $event.target.value.split(':');
						newDate.setHours(...hourSet);
						this.shift[f] = newDate;
					}
				}

				const valueLabels = viewModel.getFieldValueLabels(f);

				if (valueLabels) {
					const converter = viewModel.getFieldValueConverter(f)

					fieldManager.values = valueLabels.map((v) => {
						return {
							label: v,
							value: converter ? converter.convertTo(v) : v
						}
					})
				}

				valueManager[f] = fieldManager
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
				const dateFormatFilter = this.$options.filters.dateFormat
				for (var f in this.shift) {
					let label =  this.viewModel.getFieldLabel(f);

					if (!label) { continue; }
					let fieldManager = this.valueManager[f] || {};
					let inputType = fieldManager.inputType;

					let field = {
						label,
						inputType,
						values: fieldManager.values,
						fieldName: f,
					}

					if (inputType == 'date' || inputType == 'time') {
						field.mask = dateFormatFilter(this.shift[f], inputType == 'date' ? 'YYYY-MM-DD' : 'HH:mm');
						field.listener = fieldManager.listener
					}

					fields.push(field);
				}
				return fields;
			},
		},
		methods: {
			// announce() {
			// 	console.log(JSON.stringify(this.shift));
			// },
			onDateTimeSelected($event, fieldName) {
				this.shift[fieldName] = $event.value;
			},
			submitForm() {
				ApiService.submitShift(this.shift).then(() => {
					alert('Successfully saved!').then(() => {
						this.$emit('back');
					})
				}).catch((error) => {
					console.log(error);
				})
			},
		},
	};
</script>

<style scoped>

</style>

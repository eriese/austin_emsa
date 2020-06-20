<template native>
	<ScrollView>
		<StackLayout class="form">
			<BackButton @backPressed="$emit('back')" />
			<Label text="List a Shift" class="h1 text-center"/>
			<Stacklayout v-for="f in fields" :key="f.fieldName" class="form-field">
				<Label :text="f.label" class="form-field__label" textWrap="true"/>
				<TextField v-if="f.inputType == 'text' || f.inputType == 'textarea'" v-model="shift[f.fieldName]"  class="form-field__input"/>
				<WrapLayout v-else-if="f.inputType == 'radio'" class="form-field__input">
					<StackLayout orientation="horizontal" v-for="(v, i) in f.values" :title="v" :key="v" :class="[i == f.value ? 'form-field__input--is-selected' : 'form-field__input--is-unselected']" >
						<check-box boxType="circle" :checked="i == f.value" @checkedChange="onSelectedIndexChange($event, f.fieldName, i)" fillColor="#0e4c97"/>
						<Label :text="v" @tap="onSelectedIndexChange({value: true}, f.fieldName, i)" verticalAlignment="center"/>
					</StackLayout>
				</WrapLayout>
				<DatePickerField v-else-if="f.inputType == 'date'" :date="shift[f.fieldName]" dateFormat="EEEE M/d/yy" @dateChange="onDateTimeSelected($event, f.fieldName)" :ref="f.fieldName" />
				<TimePickerField v-else-if="f.inputType == 'time'" :time="shift[f.fieldName]" timeFormat="h:mm a" @timeChange="onDateTimeSelected($event, f.fieldName)" :ref="f.fieldName" />
			</Stacklayout>
			<Button text="Save" @tap="submitForm"/>
		</StackLayout>
	</ScrollView>
</template>


<script>
	import formComponent from '../mixins/formComponent';
	import Shift from '../components/Shift';
	import ShiftViewModel from '../components/ShiftViewModel';
	import ApiService from '../components/ApiService';
	import emsaPage from '../mixins/emsaPage';

	export default {
		name: 'ShiftForm',
		mixins: [formComponent, emsaPage],
		data() {
			const shift = new Shift();
			const valueManager = {};
			const viewModel = new ShiftViewModel(shift);
			viewModel.annotatedFields.forEach((f) => {
				valueManager[f] = {
					values: viewModel.getFieldValueLabels(f),
					converter: viewModel.getFieldValueConverter(f),
					inputType: viewModel.getFieldInputType(f)
				}
			})
			return {
				shift,
				valueManager,
				viewModel,
				boxColor: '',
				pickerShowing: false
			};
		},
		computed: {
			fields() {
				const fields = []
				for (var f in this.shift) {
					let fieldManager = this.valueManager[f];
					let label =  this.viewModel.getFieldLabel(f);

					if (!label) { continue; }

					let value;
					let inputType = 'text';
					let values;
					if (fieldManager) {
						inputType = fieldManager.inputType
						values = fieldManager.values

						if (fieldManager.converter) {
						let valueName = fieldManager.converter.convertFrom(this.shift[f]);
						value = fieldManager.values.indexOf(valueName);
						}
					} else {
						value = this.shift[f];
					}

					fields.push({
						label,
						value,
						inputType,
						values,
						fieldName: f,
					});
				}
				return fields;
			},
			fieldLabels() {
				const values = {}
				this.viewModel.annotatedFields.forEach((f) => values[f] = this.viewModel.getFieldLabel(f));
				return values;
			},
			formValues() {
				const values = {};
				for (var f in this.shift) {
					let fieldManager = this.valueManager[f];
					if (fieldManager && fieldManager.converter) {
						let valueName = fieldManager.converter.convertFrom(this.shift[f]);
						values[f] = fieldManager.values.indexOf(valueName);
					} else {
						values[f] = this.shift[f];
					}
				}

				return values;
			},
		},
		methods: {
			announce() {
				console.log(JSON.stringify(this.shift));
			},
			onDateTimeSelected($event, fieldName) {
				this.shift[fieldName] = $event.value;
			},
			onSelectedIndexChange({value}, field, index) {
				if (!value) { return; }
				const fieldManager = this.valueManager[field];
				const valueName = fieldManager.values[index];
				this.shift[field] = fieldManager.converter.convertTo(valueName);
				this.announce();
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

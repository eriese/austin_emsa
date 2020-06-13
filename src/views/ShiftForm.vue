<template native>
	<ScrollView>
		<StackLayout class="form">
			<BackButtonListener @backPressed="$emit('back')" />
			<Button text="Back" @tap="$emit('back')" class="cta--is-round pull-left"></Button>
			<Label text="List a Shift" class="h1 text-center"/>
			<Stacklayout v-for="f in viewModel.annotatedFields" :key="f" class="form-field">
				<Label :text="fieldLabels[f] || f" class="form-field__label" textWrap="true"/>
				<TextField v-if="valueManager[f] === undefined || valueManager[f].inputType == 'text' || valueManager[f].inputType == 'textarea'" v-model="shift[f]"  class="form-field__input"/>
				<WrapLayout v-else-if="valueManager[f].inputType == 'radio'" :columns="valueManager[f].colSpec" class="form-field__input">
					<StackLayout orientation="horizontal" v-for="(v, i) in valueManager[f].values" :title="v" :key="v" :class="[i == formValues[f] ? 'form-field__input--is-selected' : 'form-field__input--is-unselected']" >
						<check-box boxType="circle" :checked="i == formValues[f]" @checkedChange="onSelectedIndexChange($event, f, i)" fillColor="#0e4c97"/>
						<Label :text="v" @tap="onSelectedIndexChange({value: true}, f, i)" verticalAlignment="center"/>
					</StackLayout>
				</WrapLayout>
				<TextField v-else-if="valueManager[f].inputType == 'date' || valueManager[f].inputType == 'time'" :text="shift[f] | dateFormat(valueManager[f].inputType == 'date'? 'MM/DD/YY' : 'h:mm a')" @tap="focusPickerField(f)" @focus="focusPickerField(f)"/>
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
	import PickerModal from '../components/PickerModal';

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
			}
		},
		methods: {
			announce() {
				console.log(JSON.stringify(this.shift));
			},
			focusPickerField: async function(field) {
				if (this.pickerShowing) {return;}
				this.pickerShowing = true;
				const fieldManager = this.valueManager[field]
				const response = await this.$showModal(PickerModal, {
					props: {
						dateObject: this.shift[field],
						pickerType: fieldManager.inputType,
						fieldName: this.fieldLabels[field],
					}
				});

				if (new Date(response) != 'Invalid Date') {
					this.shift[field] = response;
				}

				this.pickerShowing = false;
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
					alert('Successfully submitted!').then(() => {
						this.$emit('back');
					})
				}).catch((error) => {
					console.log(error);
				})
			}
		},
	};
</script>

<style scoped>

</style>

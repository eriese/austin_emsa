<template>
	<ModalStack dismissEnabled="true">
		<StackLayout width="90%" class="ns-modal ns-light emsa-page">
			<Button text="X" @tap="$modal.close(null)" class="pull-right ns-modal__close-button cta--is-round"/>
			<Label :text="fieldName" class="form-field__label text-center" textWrap="true"/>
			<DatePicker v-if="pickerType == 'date'" v-model="value" class="form-field__input" />
			<TimePicker v-else v-model="value" class="form-field__input" minuteInterval="30" ref="time"/>
			<Button text="Done" @tap="$modal.close(value)" />
		</StackLayout>
	</ModalStack>
</template>

<script>
	export default {
		data() {
			return {
				value: new Date(this.dateObject)
			};
		},
		props: {
			dateObject: Date,
			pickerType: String,
			fieldName: String
		},
		mounted() {
			if (this.pickerType == 'date') {return}
			this.$nextTick(() => {
				console.log(this.$refs.time)
			})
		}
	}
</script>

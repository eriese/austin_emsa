<template web>
	<input :type="type" v-model="mask" v-bind="bind">
</template>

<template native>
	<DatePickerField v-if="type == 'date'" :date="value" dateFormat="EEEE M/d/yy" @dateChange="onDateTimeSelected" v-bind="bind"/>
	<TimePickerField v-else :time="value" timeFormat="h:mm a" @timeChange="onDateTimeSelected" v-bind="bind" />
</template>

<script>
	export default {
		props: ['type', 'value', 'bind'],
		computed: {
			format() {
				return this.type == 'date' ? 'YYYY-MM-DD' : 'HH:mm';
			},
			mask: {
				get() {
					return this.$options.filters.dateFormat(this.value, this.format);
				},
				set(newValue) {
					let emitValue;
					if (this.type == 'date') {
						emitValue = new Date(`${newValue}T00:00:01`);
					} else {
						emitValue = new Date(this.value);
						const hourSet = newValue.split(':');
						emitValue.setHours(...hourSet);
					}

					this.$emit('input', emitValue);
				}
			}
		},
		methods: {
			onDateTimeSelected($event) {
				this.$emit('input', $event.value);
			}
		}
	}
</script>

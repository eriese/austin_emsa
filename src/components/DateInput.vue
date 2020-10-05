<template web>
	<datetime :type="type" v-model="mask" value-zone="local" :use12-hour="true" :minute-step="30" v-bind="bind" :format="format" ref="timepicker" @focus="listenForTimeChanges" @close="stopListening" :title="timeTitle">
	</datetime>
</template>

<template native>
	<DatePickerField v-if="type == 'date'" :date="value" :dateFormat="format" @dateChange="onDateTimeSelected" v-bind="bind"/>
	<TimePickerField v-else :time="value" :timeFormat="format" @timeChange="onDateTimeSelected" v-bind="bind" />
</template>

<script>
	export default {
		props: ['type', 'value', 'bind'],
		data() {
			return {
				timeWatcher: null,
				timeTitle: undefined
			}
		},
		computed: {
			format() {
				return this.type == 'date' ? 'EEEE M/d/yy' : 'h:mm a';
			},
			mask: {
				get() {
					return this.value.toISOString();
				},
				set(newValue) {
					let emitValue = new Date(newValue);
					this.$emit('input', emitValue);
				}
			},
		},
		methods: {
			onDateTimeSelected($event) {
				this.$emit('input', $event.value);
			},
			listenForTimeChanges() {
				if (this.type == 'date') {return;}

				this.$nextTick(() => {
					this.timeWatcher = this.$watch(
						() => this.$refs.timepicker.$children[0].$children[0].newDatetime,
						(newValue) => {
							this.timeTitle = newValue.toFormat(this.format);
						}, {
							immediate: true,
							deep: true
					});
				});
			},
			stopListening() {
				if (this.timeWatcher) {this.timeWatcher();}
			}
		}
	}
</script>

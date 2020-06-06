<script>
	import ShiftViewModel from './ShiftViewModel';
	const tradeLabels = ['No Trade', 'Open to Trade', 'Trade Only']

	export default {
		props: {
			shift: Object
		},
		render(h) {
			const shift = this.shift;

			const model = new ShiftViewModel(shift);
			const dateFormat = this.$options.filters.dateFormat;

			const dateString = `${dateFormat(shift.shiftDate, "MM/DD/YY")} ${dateFormat(shift.shiftStart, 'h:mm a')}-${dateFormat(shift.shiftEnd, 'h:mm a')}`;

			const labels = {
				isOffering: shift.isOffering ? 'Offering' : 'Seeking',
				dates: dateString,
				position: model.getFieldValueName('position'),
				isOCP: model.getFieldValueName('isOCP'),
				isField: model.getFieldValueName('isField'),
				tradePreference: model.getFieldValueName('tradePreference', true)
			}

			return <GridLayout iosOverflowSafeArea="false" class={`shift-item shift-item--is-${labels.isOffering.toLowerCase()}`} columns="75,*,*" rows="auto, auto, auto">
					<Label text={labels.isOffering} row="0" col="0" class="shift-item__is-offering"/>
					<Label text={labels.position} row="0" col="2" class="shift-item__position text-right"/>
					<Label text={labels.dates} row="1" col="0" colSpan="3" class="shift-item__dates text-center"/>
					<Label text={labels.isField} row="2" col="0" class="shift-item__is-field"/>
					<Label text={labels.isOCP} row="2" col="1" class="shift-item__is-ocp text-center"/>
					<Label text={labels.tradePreference} row="2" col="2" class="shift-item__trade-preference text-right"/>
				</GridLayout>
		}
	}
</script>

<style scoped lang="scss">
.shift-item {
	margin-bottom: 10;
	border-radius: 5;
	border-width: 3;
	font-size: 16;

	&--is-offering {
		border-color: var(--emsa-yellow);

		.shift-item__is-offering {
			background-color: var(--emsa-yellow);
			color: var(--emsa-black);
		}
	}

	&--is-seeking {
		border-color: var(--emsa-blue);
		.shift-item__is-offering {
			background-color: var(--emsa-blue);
			color: var(--emsa-white);
		}
	}

	label {
		padding: 3;
	}

	&__position {
		font-weight: bold;
		font-size: 18;
	}

	&__is-offering {
		border-bottom-right-radius: 5;
		margin-top: -5;
	}
}
</style>

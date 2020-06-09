<script>
	import shiftDisplay from '../mixins/shiftDisplay';

	export default {
		mixins: [shiftDisplay],
		render(h) {
			return <GridLayout iosOverflowSafeArea="false" class={`shift-item shift-item--is-${this.valueLabels.isOffering.toLowerCase()}`} columns="75,*,*" rows="auto, auto, auto">
					<Label text={this.valueLabels.isOffering} row="0" col="0" class="shift-item__is-offering"/>
					<Label text={this.valueLabels.position} row="0" col="2" class="shift-item__position text-right"/>
					<Label text={this.valueLabels.dates} row="1" col="0" colSpan="3" class="shift-item__dates text-center"/>
					<Label text={this.valueLabels.isField} row="2" col="0" class="shift-item__is-field"/>
					<Label text={this.valueLabels.isOCP} row="2" col="1" class="shift-item__is-ocp text-center"/>
					<Label text={this.valueLabels.tradePreference} row="2" col="2" class="shift-item__trade-preference text-right"/>
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
	color: var(--color);

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

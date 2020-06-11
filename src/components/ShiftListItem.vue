<script>
	import shiftDisplay from '../mixins/shiftDisplay';

	export default {
		mixins: [shiftDisplay],
		render() {
			const itemClass = `shift-item shift-item--is-${this.valueLabels.isOffering.toLowerCase()}`;
			if (process.env.VUE_APP_MODE == 'native') {
				return <GridLayout iosOverflowSafeArea="false" class={itemClass} columns="75,*,*" rows="auto, auto, auto">
					<Label text={this.valueLabels.isOffering} row="0" col="0" class="shift-item__is-offering"/>
					<Label text={this.valueLabels.position} row="0" col="2" class="shift-item__position text-right"/>
					<Label text={this.valueLabels.dates} row="1" col="0" colSpan="3" class="shift-item__dates text-center"/>
					<Label text={this.valueLabels.isField} row="2" col="0" class="shift-item__is-field"/>
					<Label text={this.valueLabels.isOCP} row="2" col="1" class="shift-item__is-ocp text-center"/>
					<Label text={this.valueLabels.tradePreference} row="2" col="2" class="shift-item__trade-preference text-right"/>
				</GridLayout>
			}

			return <li class={itemClass}>
				<span class="shift-item__is-offering">{this.valueLabels.isOffering}</span>
				<span class="shift-item__position">{this.valueLabels.position}</span>
				<div class="shift-item__dates">{this.valueLabels.dates}</div>
				<div class="shift-item__bottom-row">
					<span class="shift-item__is-field">{this.valueLabels.isField}</span>
					<span class="shift-item__is-ocp">{this.valueLabels.isOCP}</span>
					<span class="shift-item__trade-preference">{this.valueLabels.tradePreference}</span>
				</div>
			</li>
		}
	}
</script>

<style scoped lang="scss">
.shift-item {
	margin-bottom: 10px;
	margin-bottom: 10;

	border-radius: 5px;
	border-radius: 5;

	border: 3px solid;
	border-width: 3;

	font-size: 1rem;
	font-size: 16;

	color: var(--color);

	list-style-type: none;

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
		border-bottom-right-radius: 5px;
		border-bottom-right-radius: 5;
		margin-top: -5;
		display: inline-block;
	}
}
</style>

<style scoped lang="scss" web>
.shift-item{
	&__is-offering {
		float: left;
		padding: 0.25rem 0.5rem;
	}
	&__position {
		float: right;
		margin-right: 0.5rem;
		margin-top: 0.25rem;
	}

	&__dates {
		clear: both;
		text-align: center;
	}

	&__bottom-row {
		padding: 0.25rem 0.5rem;
	}
	&__is-ocp {
		display: inline-block;
		clear: none;
		width: 50%;
		text-align: center;
	}

	&__is-field {
		float: left;
		width: 25%;
	}

	&__trade-preference {
		float: right;
		width: 25%;
		text-align: right;
	}

}
</style>

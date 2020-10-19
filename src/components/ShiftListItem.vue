<script>
	import ShiftDisplay from '../mixins/ShiftDisplay';

	export default {
		name: 'ShiftListItem',
		mixins: [ShiftDisplay],
		props: ['shift', 'isUser'],
		computed: {
			givenShift() {
				return this.shift;
			}
		},
		render() {
			const itemClass = `shift-item shift-item--is-${this.valueLabels.isOffering.toLowerCase()}`;
			if (process.env.VUE_APP_MODE == 'native') {
				return <GridLayout iosOverflowSafeArea="false" class={itemClass} columns="75,*,*,130" rows="auto, auto, auto">
					<Label text={this.valueLabels.isOffering} row="0" col="0" class="shift-item__is-offering"/>
					<Label text={this.valueLabels.isOcp} row="0" col="1" colSpan="2" class="shift-item__is-ocp text-center"/>
					<Label text={this.valueLabels.position} row="0" col="3" class="shift-item__position text-right"/>
					<Label text={`${this.valueLabels.date} ${this.valueLabels.time}` } row="1" col="0" colSpan="4" class="shift-item__dates text-center"/>
					<Label text={this.valueLabels.isField} row="2" col="0" class="shift-item__is-field"/>
					<Label text={this.displayedShift.isOffering ? this.valueLabels.shiftLetter : ''} row="2" col="1" class="shift-item__shift-letter text-center"/>
					<Label text={this.valueLabels.timeFrame} row="2" col="2" class="shift-item__time-frame text-center"/>
					<Label text={this.valueLabels.tradePreference} row="2" col="3" class="shift-item__trade-preference text-right"/>
				</GridLayout>
			}

			return <li class={itemClass}>
				<router-link to={{name: this.isUser ? 'UserShiftView' : 'ShiftView', params: { id: this.displayedShift.id }}}>
					<span class="shift-item__is-offering">{this.valueLabels.isOffering}</span>
					<span class="shift-item__is-ocp">{this.valueLabels.isOcp}</span>
					<span class="shift-item__position">{this.valueLabels.position}</span>
					<div class="shift-item__dates">{`${this.valueLabels.date} ${this.valueLabels.time}`}</div>
					<div class="shift-item__bottom-row">
						<span class="shift-item__is-field">{this.valueLabels.isField}</span>
						<span className="shift-item__shift-letter">{this.displayedShift.isOffering ? this.valueLabels.shiftLetter : ''}</span>
						<span className="shift-item__time-frame">{this.valueLabels.timeFrame}</span>
						<span class="shift-item__trade-preference">{this.valueLabels.tradePreference}</span>
					</div>
				</router-link>
			</li>
		}
	}
</script>

<style scoped lang="scss">
.shift-item {
	margin-bottom: 10px;
	margin-bottom: 10;

	padding: 0;

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
.shift-item {
	a {
		color: inherit;
		text-decoration: none;
	}

	&--is-seeking:hover {
		background-color: var(--emsa-blue);
		color: var(--emsa-white);
	}

	&--is-offering:hover {
		background-color: var(--emsa-yellow);
		color: var(--emsa-black);
	}

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
		display: flex;

		> * {
			flex-grow: 1;
		}
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

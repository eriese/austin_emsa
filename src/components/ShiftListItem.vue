<script>
	import ShiftDisplay from '../mixins/ShiftDisplay';
	import ShiftViewModel from '../models/ShiftViewModel';

	export default {
		name: 'ShiftListItem',
		mixins: [ShiftDisplay],
		props: ['shift', 'isUser'],
		data() {
			return {
				rows: []
			}
		},
		computed: {
			givenShift() {
				return this.shift;
			},
		},
		created() {
			const rows = [];

			const fieldConfigs = ShiftViewModel.fieldConfigs;
			this.displayFields.forEach(f => {
				const field = fieldConfigs[f];
				if (!field.display_in_list) {return;}

				let row = rows[field.list_row] || []
				row[field.list_column] = f;
				rows[field.list_row] = row;
			});

			for (var r = 0; r < rows.length; r++) {
				if (rows[r] === undefined) {
					rows[r] = ['dateTime'];
					break;
				}
			}

			this.rows = rows;
		},
		render() {
			if (!this.valueLabels.is_offering) {return '';}
			const itemClass = `shift-item shift-item--is-${this.valueLabels.is_offering.toLowerCase()}`;
			const isNative = process.env.VUE_APP_MODE == 'native';
			const rows = this.rows.map((row, rowIndex) => {
				const items = row.map((item, colIndex) => {
					const label = this.valueLabels[item];
					let labelClass = `shift-item__${item.replace('_','-')}`
					if (row.length > 1) {
						if (colIndex == 0 ) {labelClass += ' shift-item--is-first-in-row';}
						if (colIndex == row.length - 1) {labelClass += ' shift-item--is-last-in-row'}
					}

					if (isNative) {
						return <Label text={label} class={labelClass} flexGrow="1"/>
					} else {
						return <span class={labelClass}>{label}</span>
					}
				})

				const rowClass = `shift-item__row-${rowIndex} shift-item__row`;
				if (isNative) {
					return <FlexboxLayout flexWrap="noWrap" justifyContent="space-between" class={rowClass}> {items} </FlexboxLayout>
				} else {
					return <div class={rowClass}> {items} </div>
				}
			})

			if (isNative) {
				return <StackLayout class={itemClass}>{rows}</StackLayout>
			} else {
				return <li class={itemClass}>
					<router-link to={{name: this.isUser ? 'UserShiftView' : 'ShiftView', params: { id: this.displayedShift.id }}}>
						{rows}
					</router-link>
				</li>
			}
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

		.shift-item__row-0 > .shift-item--is-first-in-row {
			background-color: var(--emsa-yellow);
			color: var(--emsa-black);
		}
	}

	&--is-seeking {
		border-color: var(--emsa-blue);
		.shift-item__row-0 >.shift-item--is-first-in-row {
			background-color: var(--emsa-blue);
			color: var(--emsa-white);
		}
	}

	label {
		padding: 3;
	}
	&__row {
		clear: both;
		padding: 0.25rem 0.5rem;
		padding: 5 10;
		display: flex;
		margin: 0;

		> * {
			flex-grow: 1;
			text-align: center;

			&.shift-item--is-last-in-row {
				text-align: right;
			}

			&.shift-item--is-first-in-row {
				text-align: left;
			}

			&.shift-item__dateTime {
				clear: both;
				text-align: center;
				font-size: 20px;
				font-size: 20;
			}
		}
	}

	&__row-0 > *.shift-item--is-last-in-row {
		font-weight: bold;
		font-size: 18px;
		font-size: 18;
	}

	&__row-0 > *.shift-item--is-first-in-row {
		border-bottom-right-radius: 5px;
		border-bottom-right-radius: 5;
		margin-top: -5px;
		margin-top: -5;
		margin-left: -0.5rem;
		margin-left: -10;
		padding: 5px 0 5px 0.5rem;
		padding: 5 0 5 10;
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
}
</style>

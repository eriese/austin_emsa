<template>
	<StackLayout class="home-panel">
		<RadDataForm :source="shift"
			@propertyCommitted="announce" @editorUpdate="fixDateFormat">
			<TKEntityProperty v-for="note in annotations"
				v-tkDataFormProperty
				v-bind="note.entity">
				<TKPropertyEditor v-if="note.editor" v-tkEntityPropertyEditor :type="note.editor"></TKPropertyEditor>
			</TKEntityProperty>
		</RadDataForm>
	</StackLayout>
</template>

<script>
	import { ios } from "tns-core-modules/application";

	const segmented = 'SegmentedEditor';

	function booleanValues(trueName, falseName) {
		return new Map([[true, trueName], [false, falseName]]);
	}

	const values = {
		isField: booleanValues('Field', 'Comm'),
		position: new Map([
			[0,'Medic'],
			[1, 'CS'],
			[2, 'Captain'],
			[3, 'Commander'],
		]),
		isOffering: booleanValues('Offering', 'Picking Up'),
		isOCP: booleanValues('OCP', 'Shift'),
		tradePreference: new Map([
			[-1, 'No Thanks'],
			[0, 'I\'m Open'],
			[1, 'Trade Required']
		])
	};

	export default {
		data() {
			return {
				shift: {
					isField: true,
					position: 0,
					isOffering: true,
					shiftDate: new Date(),
					isOCP: false,
					tradePreference: -1,
					shiftStart: new Date(),
					shiftEnd: new Date(),
					tradeDates: "",
					notes: ""
				},
				values
			};
		},
		computed: {
			annotations() {
				return [{
					entity: {
							name: 'isField',
							displayName: 'Is this shift Comm or Field?',
							valuesProvider: this.values.isField,
						},
					editor: segmented
				}, {
					entity: {
						name: 'position',
						displayName: 'What\'s your position?',
						valuesProvider: this.values.position,
					},
					editor: segmented
				}, {
					entity: {
						name: 'isOffering',
						displayName: 'Are you offering a shift or picking up a shift?',
						valuesProvider: this.values.isOffering
					},
					editor: segmented
				}, {
					entity: {
						name: 'shiftDate',
						displayName: this.shift.isOffering ? 'What date is the shift you\'re offering?' : 'What date are you looking for a shift on?',
					},
					editor: 'DatePicker'
				}, {
					entity: {
						name: 'isOCP',
						displayName: 'What type of shift are you offering?',
						hidden: !this.shift.isOffering,
						valuesProvider: this.values.isOCP
					},
					editor: segmented
				}, {
					entity: {
						name: 'tradePreference',
						displayName: 'Do you want a trade for this shift?',
						valuesProvider: this.values.tradePreference,
					},
					editor: segmented
				}, {
					entity: {
						name: 'shiftStart',
						displayName: 'When does the shift start?',
					},
					editor: 'TimePicker'
				}, {
					entity: {
						name: 'shiftEnd',
						displayName: 'When does the shift end?',
					},
					editor: 'TimePicker',
				}, {
					entity: {
						name: 'notes'
					},
					editor: 'MultilineText'
				}];
			},
		},
		methods: {
			announce(args) {
				console.log(JSON.stringify(this.shift));
			},
			fixDateFormat(args) {
				if(args.propertyName == 'shiftDate') {
					const editor = args.editor;
					if (ios) {
						const dateFormatter = NSDateFormatter.alloc().init();
						dateFormatter.dateFormat = "MM/dd/yyyy";
						editor.dateFormatter = dateFormatter;
					} else {
							const simpleDateFormat = new java.text.SimpleDateFormat("MM/dd/yyyy", java.util.Locale.US);
							editor.setDateFormat(simpleDateFormat);
					}
				}
			}
		}
	};
</script>

<style scoped>
	.home-panel {
		vertical-align: center;
		font-size: 20;
		margin: 15;
	}

	.description-label {
		margin-bottom: 15;
	}
</style>

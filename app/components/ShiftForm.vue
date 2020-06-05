<template>
	<ScrollView>
		<StackLayout class="home-panel">
			<RadDataForm :source="shift"
				@propertyCommitted="announce" @editorUpdate="applyFormats">
				<TKEntityProperty v-for="note in annotations" :key="note.entity.name"
					v-tkDataFormProperty
					v-bind="note.entity">
					<TKPropertyEditor v-if="note.editor" v-tkEntityPropertyEditor :type="note.editor" :class="`emsa-${note.editor}`"></TKPropertyEditor>
				</TKEntityProperty>
			</RadDataForm>
		</StackLayout>
	</ScrollView>
</template>


<script>
	import formatFixes from './formatFixes';
	import Shift from './Shift';
	import ShiftViewModel from './ShiftViewModel';

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
			const shift = new Shift();
			return {
				shift,
				viewModel: new ShiftViewModel(shift),
				values
			};
		},
		computed: {
			annotations() {
				return this.viewModel.annotatedFields.map((f) => this.viewModel.getFieldAnnotation(f));
			},
		},
		methods: {
			announce(args) {
				console.log(JSON.stringify(this.shift));
			},
			applyFormats(args) {
				formatFixes(args);
			}
		}
	};
</script>

<style scoped>
</style>

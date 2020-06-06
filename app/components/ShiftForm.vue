<template>
	<ScrollView>
		<StackLayout class="home-panel">
			<Label text="List a Shift" class="h1 text-center"/>
			<RadDataForm :source="shift" @editorUpdate="fixEditorFormat">
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
	import formComponent from '../mixins/formComponent';
	import Shift from './Shift';
	import ShiftViewModel from './ShiftViewModel';

	export default {
		mixins: [formComponent],
		data() {
			const shift = new Shift();
			return {
				shift,
				viewModel: new ShiftViewModel(shift),
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
			}
		}
	};
</script>

<style scoped>
</style>

<template>
	<StackLayout orientation="horizontal">
		<check-box class="check-box" :fillColor="emsaBlue" ios:style="width: 25; margin-right: 0; height: 25; font-size: 18;" ios:lineWidth="2" ios:onCheckColor="white" :boxType="boxType" :checked="checked" @checkedChange="emit" :tintColor="emsaBlue" :onTintColor="emsaBlue" verticalAlignment="center" :class="`check-box--is-${boxType}`"/>
		<Label :text="text" @tap="emit" verticalAlignment="center"/>
	</StackLayout>
</template>

<script>
export default {
	props: {
		boxType: {
			type: String,
			default: 'square'
		},
		checked: Boolean,
		text: String
	},
	data() {
		return {
			emsaBlue: '#0e4c97',
		}
	},
	computed: {
		style() {
			const isCircle = this.boxType == 'circle';
			return {
				'font-size': isCircle ? 20 : 15,
				height: isCircle ? 25: 20
			}
		}
	},
	methods: {
		emit($event) {
			this.$emit('checkedChange', $event);
		}
	}
}
</script>

<style scoped lang="scss">
	.check-box {
		&--is-circle {
			font-size: 20;
			height: 25;
		}

		&--is-square {
			height: 20;
			font-size: 15;
		}
	}
</style>

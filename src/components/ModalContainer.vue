<template web>
	<div class="modal-container" focus-trap="true" @click="clickOutside">
		<div class="ns-modal emsa-modal">
			<slot/>
		</div>
	</div>
</template>

<template native>
	<ModalStack dismissEnabled="true">
		<slot/>
	</ModalStack>
</template>

<script>
	export default {
		methods: {
			clickOutside($event) {
				if ($event.target == this.$el) {
					this.$parent.$close(null);
				}
			}
		}
	}
</script>

<style web>
	.modal-container {
		background-color: rgba(0,0,0,0.5);
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		display: -ms-flexbox;
		display: flex;
		-ms-flex-align: center;
		align-items: center;
		-ms-flex-pack: center;
		justify-content: center;
	}

	.emsa-modal {
		padding: 1rem;
	}
</style>

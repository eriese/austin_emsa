<template web>
<div></div>
</template>

<template native>
<ScrollView></ScrollView>
</template>

<script>
	export default {
		props: {
			onCreate: Function
		},
		created() {
			this.onCreate(this);
		}
	}
</script>

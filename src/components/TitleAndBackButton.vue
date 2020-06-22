<template>
	<AbsoluteLayout>
		<BackButton @backPressed="$emit('backPressed')" android:top="15" ios:top="-10" left="0" style="z-index:1;"/>
		<Label width="100%" :text="text" class="h1 text-center" android:top="15" textWrap="true" style="z-index:0; width: 70%; margin-left: 15%"/>
	</AbsoluteLayout>
</template>

<script>
export default {
	props: {
		text: String
	}
}
</script>

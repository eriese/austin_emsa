<template web>
	<form novalidate @submit="onSubmit">
		<label for="email">Email</label>
		<input v-model="user.email" type="email" id="email" autocomplete="email" />
		<label for="password">Password</label>
		<input type="password" v-model="user.password" id="password"/>
		<input type="submit">
	</form>
</template>
<template native>
	<StackLayout>
		<Label text="Email"/>
		<TextField v-model="user.email" returnKeyType="next" autoCapitalizationType="none" keyboardType="email"/>
		<Label text="Password"/>
		<TextField v-model="user.password" secure="true" returnKeyType="go" autoCapitalizationType="none"/>
		<Button text="submit" @tap="onSubmit"/>
	</StackLayout>
</template>

<script>
import ApiService from '../components/ApiService';

export default {
	data() {
		return {
			user: {
				email: 'enoch.riese@gmail.com',
				password: 'password'
			}
		}
	},
	methods: {
		onSubmit(e) {
			if (typeof e.preventDefault == 'function') {
				e.preventDefault();
			}
			ApiService.login(this.user, () => {
				// this.setAuthTokenFromRequest(response);
				this.$emit('authSuccess');
			})
		}
	}
}
</script>

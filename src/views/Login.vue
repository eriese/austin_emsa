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
	<StackLayout verticalAlignment="center" class="form">
		<Image src="~/assets/images/logo.png" width="50%"/>
		<Label text="Austin EMSA Shift Swap" textWrap="true" class="h1 text-center"/>
		<StackLayout class="form-field">
			<Label text="Email" class="form-field__label"/>
			<TextField v-model="user.email" returnKeyType="next" autoCapitalizationType="none" keyboardType="email" class="form-field__input"/>
		</StackLayout>
		<StackLayout class="form-field">
			<Label text="Password" class="form-field__label"/>
			<TextField v-model="user.password" secure="true" returnKeyType="go" autoCapitalizationType="none" class="form-field__input"/>
		</StackLayout>
		<Button text="Submit" @tap="onSubmit"/>
	</StackLayout>
</template>

<script>
import ApiService from '../components/ApiService';
import emsaPage from '../mixins/emsaPage';

export default {
	mixins: [emsaPage],
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

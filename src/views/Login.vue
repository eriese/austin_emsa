<template web>
	<form novalidate @submit="onSubmit" class="side-padded text-center login-form">
		<img src="~/assets/images/logo.png" alt="Austin EMSA Logo">
		<h1 class="h1">Shift Request</h1>
		<div>
			<div class="form__error text-center">{{formError}}</div>
			<div class="form-field">
				<label class="form-field__label" for="email">Email</label>
				<p class="form-field__error">{{fieldErrors.email && `Email ${fieldErrors.email[0]}` }}</p>
				<input class="form-field__input" v-model="user.email" type="email" id="email" autocomplete="email" />
			</div>
			<div class="form-field">
				<label class="form-field__label" for="password">Password</label>
				<p class="form-field__error">{{fieldErrors.password && `Password ${fieldErrors.password[0]}`}}</p>
				<input class="form-field__input" :type="showPassword ? 'text' : 'password'" v-model="user.password" id="password"/>
			</div>
			<div class="form-field" v-if="!isLogin">
				<label for="password_confirmation" class="form-field__label">Confirm Password</label>
				<p class="form-field__error">{{fieldErrors.password_confirmation && `Password confrimation ${fieldErrors.password_confirmation[0]}` }}</p>
				<input :type="showPassword ? 'text' : 'password'"  id="password_confirmation" v-model="user.password_confirmation" class="form-field__input">
			</div>
			<button class="button cta--is-close" @click="showPassword = !showPassword"> {{showPassword ? 'Hide Password' : 'Show Password'}} </button>
			<div class="form__submit">
				<input type="submit" class="button" :value="isLogin ? 'Log In' : 'Sign Up'">
			</div>
		</div>
	</form>
</template>

<template native>
	<ScrollView class="emsa-page">
		<StackLayout verticalAlignment="center" class="form">
			<Image src="~/assets/images/logo.png" height="125"/>
			<Label text="Shift Request" textWrap="true" class="h1 text-center"/>
			<Label :text="formError" textWrap="true" class="text-center form__error"/>
			<StackLayout class="form-field">
				<Label text="Email" class="form-field__label"/>
				<Label class="form-field__error" :text="fieldErrors.email" />
				<TextField v-model="user.email" returnKeyType="next" autoCapitalizationType="none" keyboardType="email" class="form-field__input"/>
			</StackLayout>
			<StackLayout class="form-field">
				<Label text="Password" class="form-field__label"/>
				<Label class="form-field__error" :text="fieldErrors.password" />
				<TextField v-model="user.password" :secure="!showPassword" :returnKeyType="isLogin ? 'go' : 'next'" autoCapitalizationType="none" class="form-field__input" @returnPress="passwordReturnPress" ref="password"/>
			</StackLayout>
			<StackLayout class="form-field" v-if="!isLogin">
				<Label text="Confirm Password" class="form-field__label"/>
				<Label class="form-field__error" :text="fieldErrors.password_confirmation" />
				<TextField v-model="user.password_confirmation" :secure="!showPassword" returnKeyType="go" autoCapitalizationType="none" class="form-field__input" @returnPress="onSubmit" ref="password_confirmation"/>
			</StackLayout>
			<Button horizontalAlignment="right" :text="showPassword ? 'Hide Password' : 'Show Password'" @tap="showPassword = !showPassword" class="button"/>
			<Button :text="isLogin ? 'Log In' : 'Sign Up'" @tap="onSubmit" class="button"/>
			<ActivityIndicator :busy="isSubmitting" />
		</StackLayout>
	</ScrollView>
</template>

<script>
import ApiService from '../services/ApiService';
import EmsaPage from '../mixins/EmsaPage';

export default {
	name: 'Login',
	mixins: [EmsaPage],
	data() {
		return {
			formError: '',
			fieldErrors: {},
			isSubmitting: false,
			user: {
				email: '',
				password: '',
				password_confirmation: ''
			},
			showPassword: false
		}
	},
	computed: {
		isLogin() {
			return this.store.loginIndex == 0;
		},
		passwordReturnPress() {
			return this.isLogin ? this.onSubmit : () => {};
		}
	},
	methods: {
		onSubmit(e) {
			this.formError = '';
			this.fieldErrors = {};
			this.isSubmitting = true;
			if (typeof e.preventDefault == 'function') {
				e.preventDefault();
			}
			const serviceCall = this.isLogin ? ApiService.login : ApiService.signup
			const vm = this;
			serviceCall(this.user, () => {
				vm.$emit('authSuccess');
			}).catch(e => {
				vm.isSubmitting = false;
				const data = e.response.data;
				if (data.error_description) {
					vm.formError = data.error_description
				} else {
					vm.fieldErrors = data.errors
				}
			});
		}
	}
}
</script>

<style web>
	.login-form {
		margin-top: 2rem;
	}
</style>


<template web>
	<form novalidate @submit="onSubmit" class="side-padded text-center login-form">
		<img src="~/assets/images/logo.png" alt="Austin EMSA Logo">
		<h1 class="h1">Shift Request {{isAdmin ? 'Admin Panel' : ''}}</h1>
		<div class="form__message text-center">{{formMessage}}</div>
		<div v-if="store.loginIndex < 2">
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
			<div class="form-field" v-if="!isLogin">
				<label for="app_code" class="form-field__label">App Code (optional)</label>
				<p class="form-field__desc">You should have received an email from Austin EMSA with your personal app code. If you are signing up with the email address you use for your Austin EMSA membership, entering that code here will allow you to automatically be approved. If you're using a different email address or you don't have an app code, you will have to wait for administrator approval before you can use Shift Request.</p>
				<input type="text" class="form-field__input" v-model="user.app_code">
			</div>
			<button class="button cta--is-close" @click="showPassword = !showPassword" type="button"> {{showPassword ? 'Hide Password' : 'Show Password'}} </button>
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
			<Label :text="formMessage" textWrap="true" class="text-center form__message" />
			<StackLayout v-if="store.loginIndex < 2">
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
					<TextField v-model="user.password_confirmation" :secure="!showPassword" returnKeyType="next" autoCapitalizationType="none" class="form-field__input" ref="password_confirmation"/>
				</StackLayout>
				<StackLayout class="form-field" v-if="!isLogin">
					<Label class="form-field__label" text="App Code"/>
					<Label class="form-field__desc" text="You should have received an email from Austin EMSA with your personal app code. If you are signing up with the email address you use for your Austin EMSA membership, entering that code here will allow you to automatically be approved. If you're using a different email address or you don't have an app code, you will have to wait for administrator approval before you can use Shift Request."/>
					<TextField v-model="user.app_code" returnKeyType="go" class="form-field__input" @returnPress="onSubmit" autoCapitalizationType="allCharacters"/>
				</StackLayout>
				<Button horizontalAlignment="right" :text="showPassword ? 'Hide Password' : 'Show Password'" @tap="showPassword = !showPassword" class="button"/>
				<Button :text="isLogin ? 'Log In' : 'Sign Up'" @tap="onSubmit" class="button"/>
				<ActivityIndicator :busy="isSubmitting" />
			</StackLayout>
		</StackLayout>
	</ScrollView>
</template>

<script>
import ApiService from '../services/ApiService';
import EmsaPage from '../mixins/EmsaPage';

export default {
	name: 'Login',
	mixins: [EmsaPage],
	props: {
		isAdmin: Boolean
	},
	data() {
		return {
			formError: '',
			formMessage: '',
			fieldErrors: {},
			isSubmitting: false,
			user: {
				email: '',
				password: '',
				password_confirmation: '',
				app_code: ''
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
			this.formMessage = '';
			this.fieldErrors = {};
			this.isSubmitting = true;
			if (typeof e.preventDefault == 'function') {
				e.preventDefault();
			}

			if (this.isLogin) {
				ApiService.login(this.user)
					.then(() => this.$emit('authSuccess', this.isAdmin))
					.catch(this.onSubmitError);
			} else {
				ApiService.signup(this.user)
					.then((response) => {
						if (response.data.approved) {
							ApiService.login(this.user)
								.then(() => this.$emit('authSuccess', this.isAdmin))
								.catch(() => {
									this.formMessage = 'You have successfully signed up but we had a problem logging you in. Please try again from the login page.'
								})
						} else {
							this.store.loginIndex = 2;
							this.formMessage = 'You have signed up successfully but your account has not been approved by your administrator yet. We\'ll email you when it\'s time to come back and log in!'
						}
					})
					.catch(this.onSubmitError);
			}
		},
		onSubmitError(e) {
			this.isSubmitting = false;
			const data = e.response.data;
			if (data.error_description) {
				this.formError = data.error_description;
			} else {
				this.fieldErrors = data.errors;
			}
		}
	}
}
</script>

<style web>
	.login-form {
		margin-top: 2rem;
	}
</style>


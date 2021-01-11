<template web>
	<form novalidate @submit="onSubmit" class="side-padded text-center login-form">
		<img src="~/assets/images/logo.png" alt="Austin EMSA Logo">
		<h1 class="h1">Shift Request {{isAdmin ? 'Admin Panel' : ''}}</h1>
		<h2 class="h2">{{titleText}}</h2>
		<div class="form__message text-center">{{formMessage}}</div>
		<div v-if="store.loginIndex < 3">
			<div class="form__error text-center">{{formError}}</div>
			<div class="form-field" v-if="store.loginIndex < 2">
				<label class="form-field__label" for="email">Email</label>
				<p class="form-field__description" v-if="!isLogin">Reminder: Use your first.last@austintexas.gov email format</p>
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

			<button class="button cta--is-close" @click="showPassword = !showPassword" type="button"> {{showPassword ? 'Hide Password' : 'Show Password'}} </button>
			<div style="clear: both" class="text-right">
				<router-link v-if="isLogin" :to="{name: 'ForgotPassword'}" class="link">Forgot your password?</router-link>
			</div>
			<div class="form__submit">
				<input type="submit" class="button" :value="submitText">
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
			<StackLayout v-if="store.loginIndex < 3">
				<StackLayout class="form-field" v-if="store.loginIndex < 2">
					<Label text="Email" class="form-field__label"/>
					<Label v-if="!isLogin" textWrap="true" text="Reminder: Use your first.last@austintexas.gov email format)" class="form-field__description" />
					<Label class="form-field__error" v-if="fieldErrors.email" :text="fieldErrors.email" />
					<TextField v-model="user.email" returnKeyType="next" autoCapitalizationType="none" keyboardType="email" class="form-field__input"/>
				</StackLayout>
				<StackLayout class="form-field">
					<Label text="Password" class="form-field__label"/>
					<Label class="form-field__error" v-if="fieldErrors.password" :text="fieldErrors.password" />
					<TextField v-model="user.password" :secure="!showPassword" :returnKeyType="isLogin ? 'go' : 'next'" autoCapitalizationType="none" class="form-field__input" @returnPress="passwordReturnPress" ref="password"/>
				</StackLayout>
				<StackLayout class="form-field" v-if="!isLogin">
					<Label text="Confirm Password" class="form-field__label"/>
					<Label class="form-field__error" v-if="fieldErrors.password_confirmation" :text="fieldErrors.password_confirmation" />
					<TextField v-model="user.password_confirmation" :secure="!showPassword" returnKeyType="go" @returnPress="onSubmit" autoCapitalizationType="none" class="form-field__input" ref="password_confirmation"/>
				</StackLayout>
				<Button horizontalAlignment="right" :text="showPassword ? 'Hide Password' : 'Show Password'" @tap="showPassword = !showPassword" class="button"/>
				<Button :text="submitText" @tap="onSubmit" class="button"/>
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
				resetPasswordToken: this.$route && this.$route.query['reset_password_token'],
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
		},
		submitText() {
			return ['Log In', 'Sign Up'][this.store.loginIndex] || 'Submit';
		},
		titleText() {
			return ['Log In', 'Sign Up', 'Reset Password'][this.store.loginIndex];
		},
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

			let submitCall;
			let onSuccess;
			switch (this.store.loginIndex) {
				case 0:
					submitCall = ApiService.login;
					onSuccess = () => this.$emit('authSuccess', this.isAdmin);
					break;
				case 1:
					submitCall = ApiService.signup;
					onSuccess = (response) => {
						if (response.data.approved) {
							this.loginOrCaveat('You have successfully signed up but we had a problem logging you in. Please try again from the login page.');
						} else {
							this.showLoginCaveat("You have signed up successfully but we don't recognize your email address, so your account has not been approved by your administrator yet. We'll email you when it's time to come back and log in!")
						}
					}
					break;
				case 2:
					submitCall = ApiService.submitReset;
					onSuccess = (response) => {
						this.user.email = response.data.email;
						this.loginOrCaveat('You have successfully reset your password, but we were unable to automatically log you in. Please go to the log in page to try again.');
					}
			}

			submitCall(this.user).then(onSuccess).catch(this.onSubmitError);
		},
		showLoginCaveat(caveat) {
			this.store.loginIndex = 3;
			this.formMessage = caveat;
		},
		loginOrCaveat(caveat) {
			ApiService.login(this.user)
				.then(() => this.$emit('authSuccess', this.isAdmin))
				.catch(() => this.showLoginCaveat(caveat));
		},
		onSubmitError(e) {
			this.isSubmitting = false;
			const data = e.response.data;
			if (data.message) {
				this.formError = data.message;
			} else if (data.error_description) {
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


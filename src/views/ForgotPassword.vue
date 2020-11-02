<template web>
	<form novalidate @submit="onSubmit" class="side-padded text-center login-form">
		<img src="~/assets/images/logo.png" alt="Austin EMSA Logo">
		<div v-if="!submitted">
			<h1 class="h1">Forgot your password?</h1>
			<h2>Enter your email address and we'll send you reset instructions.</h2>
			<div class="form-field">
				<label for="email" class="form-field__label">Email*</label>
				<input type="text" class="form-field__input" name="email" v-model="user.email">
			</div>
			<div class="form__submit"><input type="submit" class="button" value="submit"></div>
		</div>
		<div v-if="submitted">
			<div class="form__message text-center">{{formMessage}}</div>
			<router-link class="button" :to="{name: 'Login'}">Back to Login</router-link>
		</div>
	</form>
</template>

<script>
import ApiService from '../services/ApiService';
import EmsaPage from '../mixins/EmsaPage';

export default {
	name: 'ForgotPassword',
	mixins: [EmsaPage],
	data() {
		return {
			user: {
				email: ''
			},
			formMessage: '',
			submitted: false,
		}
	},
	methods: {
		onSubmit: function(e) {
			this.formError = '';
			if (typeof e.preventDefault == 'function') {
				e.preventDefault();
			}

			ApiService.requestReset(this.user).then(() => {
				this.submitted = true;
				this.formMessage = 'If your email address exists in our database, you will receive a password recovery link at your email address in a few minutes. Please note: it may take up to 10 minutes for the email to arrive.';
			}).catch((e) => {
				console.log(e);
				this.submitted = true;
				this.formMessage = 'Something went wrong. Please try again later';
			});
		}
	}
}
</script>

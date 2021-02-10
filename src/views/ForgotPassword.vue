<template web>
	<form novalidate @submit="onSubmit" class="side-padded text-center login-form">
		<BackButton @backPressed="$emit('back')"/>
		<img src="~/assets/images/logo.png" alt="Austin EMSA Logo">
		<div v-if="!submitted">
			<h1 class="h1">{{title}}</h1>
			<h2>{{text}}</h2>
		</div>
		<div class="form__message text-center">{{formMessage}}</div>
		<div v-if="!submitted">
			<div class="form-field">
				<label for="email" class="form-field__label">Email*</label>
				<input type="text" class="form-field__input" name="email" v-model="user.email">
			</div>
			<div class="form__submit"><input type="submit" class="button" value="submit"></div>
		</div>
		<div v-if="submitted">
			<router-link class="button" :to="{name: 'Login'}">Back to Login</router-link>
		</div>
	</form>
</template>
<template native>
	<ScrollView class="emsa-page">
		<StackLayout height="100%">
			<BackButton @backPressed="$emit('back')"/>
			<StackLayout verticalAlignment="center" class="form">
				<Image src="~/assets/images/logo.png" height="125"/>
				<StackLayout v-if="!submitted">
					<Label :text="title" textWrap="true" class="h1 text-center"/>
					<Label :text="text" textWrap="true" class="h2 text-center"/>
					<Label :text="formError" textWrap="true" class="text-center form__error"/>
				</StackLayout>
				<Label :text="formMessage" textWrap="true" class="text-center form__message" />
				<StackLayout v-if="!submitted">
					<StackLayout class="form-field">
						<Label text="Email*" class="form-field__label"/>
						<TextField v-model="user.email" autoCapitalizationType="none" keyboardType="email" class="form-field__input" @returnPress="onSubmit" returnKeyType="go"/>
					</StackLayout>
					<Button text="submit" @tap="onSubmit" class="button"/>
				</StackLayout>
			</StackLayout>
		</StackLayout>
	</ScrollView>
</template>

<script>
import ApiService from '../services/ApiService';
import EmsaPage from '../mixins/EmsaPage';

const formSettings = {
	reset: {
		title: 'Forgot your password?',
		text: 'Enter your email address and we\'ll send you reset instructions.',
		success: 'If your email address exists in our database, you will receive a password recovery link at your email address in a few minutes. Please note: it may take up to 10 minutes for the email to arrive.',
		requestFunc: ApiService.requestReset
	},
	confirmation: {
		title: 'Need email confirmation instructions?',
		text: 'Enter your email address and we\'ll send you a confirmation email',
		success: 'If your email address exists in our database, you will receive an email confirmation link at your email address in a few minutes. Please note: it may take up to 10 minutes for the email to arrive.',
		requestFunc: ApiService.requestConfirmation
	},
	default: {}
}

export default {
	name: 'ForgotPassword',
	mixins: [EmsaPage],
	data() {
		return {
			user: {
				email: ''
			},
			formMessage: '',
			formError: '',
			submitted: false,
		}
	},
	props: {
		formType: String
	},
	computed: {
		formSettings() {
			return formSettings[this.formType] || formSettings.default;
		},
		title() {
			return this.formSettings.title
		},
		text() {
			return this.formSettings.text
		}
	},
	methods: {
		onSubmit: function(e) {
			this.formError = '';
			this.formMessage = '';
			if (typeof e.preventDefault == 'function') {
				e.preventDefault();
			}
			if (!this.user.email) {
				this.formError = 'Please enter a valid email address';
				return;
			}

			this.formSettings.requestFunc(this.user).then(() => {
				this.submitted = true;
				this.formMessage = this.formSettings.success;
			}).catch((e) => {
				console.log(e);
				// this.submitted = true;
				this.formMessage = 'Something went wrong. Please try again later';
			});
		}
	}
}
</script>

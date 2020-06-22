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
	<GridLayout rows="*, auto">
		<FlexboxLayout class="emsa-menu" alignItems="center" justifyContent="center" row="1">
			<Button class="emsa-menu__item text-center" :class="{'emsa-menu__item--is-selected': loginIndex == 0}" text="Returning User" @tap="loginIndex = 0" flexGrow="1"/>
			<Button class="emsa-menu__item text-center" :class="{'emsa-menu__item--is-selected': loginIndex == 1}" text="New User" @tap="loginIndex = 1" flexGrow="1"/>
		</FlexboxLayout>
		<ScrollView row="0" class="emsa-page">
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
	</GridLayout>
</template>

<script>
import ApiService from '../components/ApiService';
import emsaPage from '../mixins/emsaPage';


export default {
	name: 'Login',
	mixins: [emsaPage],
	data() {
		return {
			formError: '',
			fieldErrors: {},
			isSubmitting: false,
			loginIndex: 0,
			loginItems: ['Returning User', 'New User'],
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
			return this.loginIndex == 0;
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

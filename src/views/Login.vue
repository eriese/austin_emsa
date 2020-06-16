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
		<SegmentedBar class="emsa-menu" v-model="loginIndex" row="1">
			<SegmentedBarItem class="emsa-menu__item" title="Returning User" />
			<SegmentedBarItem class="emsa-menu__item" title="New User" />
		</SegmentedBar>
		<StackLayout verticalAlignment="center" class="form emsa-page" row="0">
			<Image src="~/assets/images/logo.png" height="125"/>
			<Label text="Austin EMSA Shift Swap" textWrap="true" class="h1 text-center"/>
			<StackLayout class="form-field">
				<Label text="Email" class="form-field__label"/>
				<TextField v-model="user.email" returnKeyType="next" autoCapitalizationType="none" keyboardType="email" class="form-field__input"/>
			</StackLayout>
			<StackLayout class="form-field">
				<Label text="Password" class="form-field__label"/>
				<TextField v-model="user.password" secure="true" :returnKeyType="isLogin ? 'go' : 'next'" autoCapitalizationType="none" class="form-field__input" @returnPress="isLogin ? onSubmit : undefined" ref="password"/>
			</StackLayout>
			<StackLayout class="form-field" v-if="!isLogin">
				<Label text="Confirm Password" class="form-field__label"/>
				<TextField v-model="user.password_confirmation" secure="true" returnKeyType="go" autoCapitalizationType="none" class="form-field__input" @returnPress="onSubmit" ref="password_confirmation"/>
			</StackLayout>
			<Button :text="isLogin ? 'Log In' : 'Sign Up'" @tap="onSubmit"/>
		</StackLayout>
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
			loginIndex: 0,
			loginItems: ['Returning User', 'New User'],
			user: {
				email: '',
				password: '',
				password_confirmation: ''
			}
		}
	},
	computed: {
		isLogin() {
			return this.loginIndex == 0;
		}
	},
	methods: {
		onSubmit(e) {
			if (typeof e.preventDefault == 'function') {
				e.preventDefault();
			}
			const serviceCall = this.isLogin ? ApiService.login : ApiService.signup
			serviceCall(this.user, () => {
				this.$emit('authSuccess');
			})
		}
	}
}
</script>

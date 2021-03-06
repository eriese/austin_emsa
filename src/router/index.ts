import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Views from '../views/Views';
import Store from '../services/Store';
import ApiService from '../services/ApiService';
import Shift from '../models/Shift';
import ShiftFilterSet from '../models/ShiftFilterSet';
import AdminPanel from '../views/AdminPanel.vue';
import CodeUploader from '../views/CodeUploader.vue';

const routes: Array<RouteConfig> = [
	{
		path: '/me',
		name: 'UserView',
		component: Views.UserView,
	},
	{
		path: '/me/:id',
		name: 'UserShiftView',
		component: Views.ShiftView,
		meta: {isUser: true}
	},
	{
		path: '/shift/:id',
		name: 'ShiftView',
		component: Views.ShiftView,
	},
	{
		path: '/shifts',
		name: 'ShiftList',
		component: Views.ShiftList,
		beforeEnter(toRoute, fromRoute, next) {
			if (Object.keys(toRoute.query).length === 0) {
				next({name: 'ShiftList', query: Object.assign(toRoute.query, Store.currentFilters.asQuery())});
			}
			else {
				Store.currentFilters = new ShiftFilterSet(toRoute.query);
				next();
			}
		}
	},
	{
		path: '/shifts/new',
		name: 'ShiftForm',
		component: Views.ShiftForm,
	},
	{
		path: '/stationcodes',
		name: 'StationCodes',
		component: Views.StationCodes
	},
	{
		path: '/login',
		name: 'Login',
		component: Views.Login,
		meta: {skipAuth: true},
		beforeEnter(toRoute, fromRoute, next) {
			Store.loginIndex = 0;
			next();
		}
	},
	{
		path: '/signup',
		name: 'Signup',
		component: Views.Login,
		meta: {skipAuth: true},
		beforeEnter(toRoute, fromRoute, next) {
			Store.loginIndex = 1;
			next();
		}
	},
	{
		path: '/recover',
		name: 'ForgotPassword',
		component: Views.ForgotPassword,
		props: {formType: 'reset'},
		meta: {skipAuth: true},
	},
	{
		path: '/password/edit',
		name: 'PasswordReset',
		component: Views.Login,
		meta: {skipAuth: true},
		beforeEnter(toRoute, fromRoute, next) {
			Store.loginIndex = 2;
			next();
		}
	},{
		path: '/confirm',
		name: 'ConfirmEmail',
		component: Views.ConfirmEmail,
		meta: {skipAuth: true},
		props: {formType: 'confirmation'}
	},
	{
		path: '/confirmation',
		component: Views.Interstitial,
		name: 'SubmitConfirmation',
		meta: {skipAuth: true},
		props: {
			onCreate(vm: Vue) {
				ApiService.submitConfirmation(<string>vm.$route.query['confirmation_token'])
					.then(() => {
						vm.$emit('authSuccess');
						alert('Email successfully confirmed');
					})
					.catch(() => {
						vm.$emit('authFailure');
						alert('Something went wrong. Failed to confirm email address. Try logging and follow any instructions given.')
					})
			}
		}
	},
	{
		path: '/admin/login',
		name: 'AdminLogin',
		component: Views.Login,
		meta: {skipAuth: true},
		props: {isAdmin: true},
		beforeEnter(toRoute, fromRoute, next) {
			Store.loginIndex = 0;
			next();
		}
	},
	{
		path: '/admin/approve',
		name: 'AdminApproval',
		component: AdminPanel,
		props: {
			propName: 'approved'
		}
	},
	{
		path: '/admin/admins',
		name: 'AdminManagement',
		component: AdminPanel,
		props: {
			propName: 'admin'
		}
	},
	{
		path: '/admin/codes',
		name: 'AdminCodes',
		component: CodeUploader
	}
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes,
	scrollBehavior (to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition
		} else {
			return { x: 0, y: 0 }
		}
	}
})

router.beforeEach(async (toRoute, fromRoute, next) => {
	let isAuthed = Store.isAuthed;
	if (isAuthed === null) {
		isAuthed = await Store.testToken();
	}

	const isAdmin = toRoute.matched.some(record => record.name && record.name.includes('Admin'));

	if (toRoute.matched.some(record => !record.meta.skipAuth == isAuthed)) {
		next();
	} else if (!isAuthed) {
		next({name: isAdmin ? 'AdminLogin': 'Login'});
	} else {
		const nextRoute = isAdmin ? {name: 'AdminApproval'} : {name: 'ShiftList', query: Store.currentFilters.asQuery()}
		next(nextRoute);
	}
})

export default router

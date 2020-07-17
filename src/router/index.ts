import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Views from '../views/Views';
import Store from '../services/Store';
import ApiService from '../services/ApiService';
import Shift from '../models/Shift';
import ShiftFilterSet from '../models/ShiftFilterSet';
import AdminPanel from '../views/AdminPanel.vue';

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

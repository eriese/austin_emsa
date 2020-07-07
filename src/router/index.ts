import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Views from '../views/Views';
import Store from '../services/Store';
import ApiService from '../services/ApiService';
import Shift, {ShiftFilterSet} from '../models/Shift';

const routes: Array<RouteConfig> = [
	{
		path: '/me',
		name: 'UserView',
		component: Views.UserView,
		meta: {requiresAuth: true}
	},
	{
		path: '/me/:id',
		name: 'UserShiftView',
		component: Views.ShiftView,
		meta: {requiresAuth: true, isUser: true}
	},
	{
		path: '/shift/:id',
		name: 'ShiftView',
		component: Views.ShiftView,
		meta: {requiresAuth: true},
	},
	{
		path: '/shifts',
		name: 'ShiftList',
		component: Views.ShiftList,
		meta: {requiresAuth: true},
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
		meta: {requiresAuth: true}
	},
	{
		path: '/login',
		name: 'Login',
		component: Views.Login,
		meta: {requiresAuth: false},
		beforeEnter(toRoute, fromRoute, next) {
			Store.loginIndex = 0;
			next();
		}
	},
	{
		path: '/signup',
		name: 'Signup',
		component: Views.Login,
		meta: {requiresAuth: false},
		beforeEnter(toRoute, fromRoute, next) {
			Store.loginIndex = 1;
			next();
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
		isAuthed = await ApiService.testToken();
		Store.isAuthed = isAuthed;
	}

	if (toRoute.matched.some(record => record.meta.requiresAuth == isAuthed)) {
		next();
	} else if (!isAuthed) {
		next({name: 'Login'});
	} else {
		next({name: 'ShiftList', query: Store.currentFilters.asQuery()});
	}
})

export default router

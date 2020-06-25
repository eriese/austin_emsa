import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Views from '../views/Views';

Vue.use(VueRouter)

	const routes: Array<RouteConfig> = [
	{
		path: '/',
		name: 'ShiftList',
		component: Views.ShiftList,
		meta: {requiresAuth: true},
		props: (route) => ({

		})
	},
	{
		path: '/me',
		name: 'UserView',
		component: Views.UserView,
		meta: {requiresAuth: true}
	},
	{
		path: '/shift/:id',
		name: 'ShiftView',
		component: Views.ShiftView,
		meta: {requiresAuth: true},
	}
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

export default router

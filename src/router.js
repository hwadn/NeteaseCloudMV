import Vue from 'vue'
import VueRouter from 'vue-router'

import All from './components/mv/All.vue'
import Board from './components/mv/Board.vue'
import New from './components/mv/New.vue'
import Record from './components/others/Record.vue'
import Links from './components/others/Links.vue'

Vue.use(VueRouter)

const routes = [
	{path: '/', redirect: '/all'},
	{path: '/all', component: All},
	{path: '/board', component: Board},
	{path: '/new', component: New},
	{path: '/record', component: Record},
	{path: '/links', component: Links},
]


export default new VueRouter({
	routes
})
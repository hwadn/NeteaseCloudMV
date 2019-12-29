import Vue from 'vue'
import VueRouter from 'vue-router'

import All from './components/mv/All.vue'
import Board from './components/mv/Board.vue'
import New from './components/mv/New.vue'

Vue.use(VueRouter)

const routes = [
	{path: '/', redirect: '/all'},
	{path: '/all', component: All},
	{path: '/board', component: Board},
	{path: '/new', component: New}
]

export default new VueRouter({
	routes
})
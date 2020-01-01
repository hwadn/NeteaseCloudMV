import Vue from 'vue'
import VueRouter from 'vue-router'

import All from './components/mv/All.vue'
import Board from './components/mv/Board.vue'
import New from './components/mv/New.vue'
import Comment from './components/others/Comment.vue'
import Links from './components/others/Links.vue'

Vue.use(VueRouter)

const routes = [
	{path: '/', redirect: '/all'},
	{path: '/all', component: All},
	{path: '/board', component: Board},
	{path: '/new', component: New},
	{path: '/comment', component: Comment},
	{path: '/links', component: Links},
]


export default new VueRouter({
	routes
})
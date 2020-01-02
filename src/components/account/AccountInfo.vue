<template>
	<div class="account-info">
		<div class="buttons" v-show="!this.$root.$data.loged">
			<button class="btn" @click="showLogin=true;showRegister=false">登录</button>
			<button class="btn" @click="showRegister=true;showLogin=false">注册</button>
		</div>
		<div class="info" v-show="this.$root.$data.loged">
			<div class="username">{{this.$root.$data.username}}</div>
			<div class="logout" @click="logout">登出</div>
		</div>
		<keep-alive>
			<transition name="move">
				<Login v-show="showLogin" @close="showLogin=false" @toregister="showRegister=true;showLogin=false"></Login>
			</transition>
		</keep-alive>
		<keep-alive>
			<transition name="move">
				<Register v-show="showRegister" @close="showRegister=false"></Register>
			</transition>
		</keep-alive>
	</div>
</template>
<script>
	import Login from './Login.vue'
	import Register from './Register.vue'
	import myAjax from '../../functions/ajax.js'
	import urls from '../../functions/urls.js'
	import eventBus from '../../functions/eventBus.js'
	export default {
		components: {
			Login,
			Register
		},
		data: ()=>{
			return {
				// 登录显示
				showLogin: false,
				// 注册显示
				showRegister: false,
			};
		},
		mounted(){
			// 校验cookie是否存在或过期，否则登录
			myAjax.get(`${urls.nodeUrl}/isLogin`).then(value=>{
				if(value){
					this.$root.$data.loged = true;
					this.$root.$data.username = value;
				}
			});
			// 监听登录事件
			eventBus.$on('showLogin', ()=>{
				this.showLogin = true;
			});
		},
		methods:{
			// 登出。清除cookie
			logout(){
				myAjax.post(`${urls.nodeUrl}/logout`).then(value=>{
					let res = JSON.parse(value);
					if(res.code == 1){
						this.$root.$data.loged = false;
						this.$root.$data.username = '';
					}
				});
			}
		}
	}
</script>
<style scoped>
	.move-enter{
		left: 50%;
		transform: translateX(-50%) translateY(-120%);
	}
	.move-enter-active{
		transition: transform 0.5s ease-out, left 0.5s ease-out;
	}
	.account-info{
		display: inline-block;
		vertical-align: middle;
	}
	.account-info .btn{
		text-decoration: underline;
		font-size: 1rem;
		padding: 5px;
		color: white;
		outline: none;
		border: none;
		background-color: transparent;
	}
	.account-info .btn:hover{
		cursor: pointer;
	}
	.account-info .btn:active{
		color: yellow;
	}
	.info{
		min-width: 40px;
		padding-right:10px;
	}
	.info .username{
		position: relative;
		padding-right: 5px;
		text-align: right;
	}
	.info .logout{
		background-color: gray;
		line-height: 2rem;
		display: none;
		padding: 0 5px;
	}
	.info .username:after{
		content: '';
		display: inline-block;
		box-sizing: border-box;
		border: 0.3rem solid rgba(0,0,0,0);
		border-top: 0.3rem solid white;
		position: absolute;
		right: -10px;
		top: 1.8rem;
	}
	.info:hover{
		cursor: pointer;
	}
	.info:hover .username{
		background-color: gray;
		border-radius: 5px 5px 0 0;
	}
	.info:hover .logout{
		display: block;
		border-radius: 0 0 5px 5px;
	}
	.logout:hover{
		background-color: rgb(0,100,200);
	}
	.logout:active{
		color: yellow;
	}
</style>
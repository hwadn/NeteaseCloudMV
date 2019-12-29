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
		<Login v-show="showLogin" @close="showLogin=false" @toregister="showRegister=true;showLogin=false"></Login>
		<Register v-show="showRegister" @close="showRegister=false"></Register>
	</div>
</template>
<script>
	import Login from './Login.vue'
	import Register from './Register.vue'
	import myAjax from '../../api/ajax.js'
	import urls from '../../api/urls.js'
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
		created(){
			// 校验cookie是否存在或过期，否则登录
			myAjax.get(`${urls.nodeUrl}/isLogin`).then(value=>{
				if(value){
					this.$root.$data.loged = true;
					this.$root.$data.username = value;
				}
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
	.account-info{
		display: inline-block;
		vertical-align: middle;
	}
	.account-info{

	}
	.account-info .buttons{
	}
	.account-info .btn{
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
	}
	.info:hover .logout{
		display: block;
	}
	.logout:hover{
		background-color: rgb(0,100,200);
	}
	.logout:active{
		color: yellow;
	}
</style>
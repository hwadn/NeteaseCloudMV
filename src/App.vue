<template>
	<div>
		<div class='head'>
			<Weather></Weather>
			<h3 class="title">网易云MV在线交流</h3>
			<span class="account login-click" @click="isLogin = true;isRegister=false">登录</span>
			<span class="account register-click"  @click="isLogin = false;isRegister=true">注册</span>
		</div>
		<div class="body">
			<div class='others'>空白</div>
			<MV></MV>
			<div class='chat'>在线交流</div>
		</div>
		<div class='footer'>
			联系邮箱：chd1994@foxmail.com
		</div>
		<Login v-if="isLogin" @closeCur="isLogin=false"></Login>
		<Register v-if="isRegister" @closeCur="isRegister=false"></Register>
	</div>
</template>
<script>
	import Weather from './components/Weather.vue'
	import Login from './components/account/Login.vue'
	import Register from './components/account/Register.vue'
	import MV from './components/Mv.vue'
	export default {
		data:()=>{
			return {
				// 登录显示
				isLogin: false,
				// 注册显示
				isRegister: false,
			}
		},
		components:{
			Weather,
			Login,
			Register,
			MV,
		}
	};
</script>
<style>
	/*屏幕尺寸适应*/
	@media (max-width: 800px) {
		.weather, .others{
			display: none;
		}
	}
	@media (max-width: 600px) {
		.weather, .account, .others, .chat{
			display: none;
		}
	}
	/*头部*/
	.head{
		height: 3.75rem;
		line-height: 3.75rem;
		text-align: center;
		background-color: rgb(34,34,34);
		color: white;
	}
	.head .weather{
		position: absolute;
		padding: 0 5px;
	}
	.head .title{
		display: inline;
	}
	.head .account{
		position: absolute;
		text-decoration: underline;
	}
	.head .account:hover{
		color: rgb(170, 255, 255);
		cursor: pointer;
	}
	.head .login-click{
		right: 3.75rem;
	}
	.head .register-click{
		right: 0.7rem;
	}
	/*主体*/
	.body{
		display: flex;
		padding: 1.2rem 0;
		background-color: rgb(221,221,221);
	}
	.body .others{
		flex: 1;
		margin-left: 0.625rem;
		margin-right: 1.25rem;
		/*height: 300px;*/
		background-color: white;
	}
	.body .mv{
		flex: 3;
		background-color: white;
		min-height: 37.5rem;
	}
	.body .chat{
		flex: 1;
		margin-left: 1.25rem;
		margin-right: 0.625rem;
		background-color: white;
	}
	/*脚部*/
	.footer{
		height: 3.75rem;
		line-height: 3.75rem;
		background-color: black;
		color: white;
		text-align: center;
	}
</style>
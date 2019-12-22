<template>
	<div class="login">
		<Cross @click.native="closeCur"></Cross>
		<div class="form">
			<div class="item">
				<input class="ipt" type="text" v-model="userName.inputValue" @input="userNameTest" placeholder="用户名：5-10位，仅限字母或数字组合">
				<div class="warn">{{userName.msg}}</div>
			</div>
			<div class="item">
				<input class="ipt" type="password" v-model="password.inputValue" @input="passwordTest" placeholder="密码：4-20位，仅限字母或数字组合">
				<div class="warn">{{password.msg}}</div>
			</div>
			<div class="item">
				<IdentifyCode ref="verifyCode" @update="msgUpdate"></IdentifyCode>
				<div class="warn">{{verify.msg}}</div>
			</div>
			<div class="login-btn" @click="submit">登录</div>
			<div class="item">没有账号 <span class="to-register" @click="toRegister">立即注册</span></div>
		</div>
	</div>
</template>
<script>
	import Cross from '../multiplex/Cross.vue'
	import IdentifyCode from './IdentifyCode.vue'
	import test from '../../api/Test.js'

	export default {
		data:()=>{
			return {
				// 用户名校验信息
				userName: {
					inputValue: '',
					isOk: false,
					msg: '', // 错误提示
				},
				// 密码校验信息
				password: {
					inputValue: '',
					isOk: false,
					msg: '',
				},
				// 图形验证码校验信息
				verify:{
					// 校验提醒
					msg: '',
				}
			};
		},
		components: {
			Cross, // 右上角打叉
			IdentifyCode  // 图像验证码
		},
		methods:{
			// 关闭页面
			closeCur(){
				this.$emit('closeCur');
			},
			// 验证用户名
			userNameTest(){
				// 字符限制
				let characterRes = test.isCharacter(this.userName.inputValue);
				this.userName.isOk = characterRes[0];
				this.userName.msg = characterRes[1]; 
				if(characterRes[0]){
					// 长度限制
					let lengthRes = test.isLength(this.userName.inputValue, 5, 10);
					this.userName.isOk = lengthRes[0];
					this.userName.msg = lengthRes[1]; 
				}
			},
			// 验证密码
			passwordTest(){
				// 字符限制
				let characterRes = test.isCharacter(this.password.inputValue);
				this.password.isOk = characterRes[0];
				this.password.msg = characterRes[1]; 
				if(characterRes[0]){
					// 长度限制
					let lengthRes = test.isLength(this.password.inputValue, 4, 20);
					this.password.isOk = lengthRes[0];
					this.password.msg = lengthRes[1]; 
				}
			},
			// 更新校验提醒
			msgUpdate(res){
				this.verify.msg = res;
			},
			// 提交表单
			submit(){
				let that = this;
				// 格式信息是否都正确
				if(this.userName.isOk && this.password.isOk){
					// 等着验证码校验成功
					this.$refs.verifyCode.verify().then(res=>{
						/////////////////////////////////
						// 这里做表单提交
						////////////////////////////////
						window.console.log('登录');
					},errmsg=>{
						that.verify.msg = errmsg;
					});
				}else{
					window.alert('请输入完整');
				}
			},
			// 跳转到注册
			toRegister(){
				// 这里做路由跳转
				window.console.log('去注册');
			}
		}
	}
</script>
<style scoped>
	.login{
		border: 2px solid black;
		position: fixed;
		padding: 42px 20px 20px;
		left:50%;
		top:50%;
		transform: translateX(-50%) translateY(-50%);
		background-color: white;
	}
	.form{
		text-align: center;
		padding: 20px;
	}
	.form .ipt{
		box-sizing: border-box;
		height:40px;
		width:240px;
	}
	.form .identifyCode{
		height:40px;
		width:240px;
	}
	.form .login-btn{
		box-sizing: border-box;
		width: 100%;
		height: 40px;
		line-height: 40px;
		color: white;
		background-color: rgb(0,100,250);
	}
	.form .login-btn:hover{
		cursor: pointer;
		background-color: rgb(0,120,250);
	}
	.form .login-btn:active{
		background-color: rgb(0,200,250);
	}
	.item{
		margin-bottom: 5px;
	}
	.item:last-child{
		margin-top: 20px;
		margin-bottom: 0;
		text-align: right;
	}
	.item .warn{
		padding: 5px;
		font-size: 10px;
		height: 12px;
		line-height: 12px;
		color: red;
		text-align: left;
	}
	.item .to-register{
		text-decoration: underline;
		color: blue;
		font-weight: bold;
	}
	.item .to-register:hover{
		cursor: pointer;
	}
	.item .to-register:active{
		color: black;
	}
</style>
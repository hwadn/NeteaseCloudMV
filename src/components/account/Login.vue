<template>
	<div class="login">
		<Cross @click.native="closeCur" :class="{registering: registering}"></Cross>
		<div class="form">
			<div class="item">
				<input class="ipt" type="text" v-model="userName.inputValue" @input="userNameTest" placeholder="用户名：3-10位，仅限字母或数字组合">
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
			<div class="login-btn" v-debounce:click="submit" :class="{registering: registering}">登录</div>
			<div class="item">没有账号 <span class="to-register" @click="toregister">立即注册</span></div>
		</div>
		<div class='registeringmsg' v-show="registering">登录中...</div>
	</div>
</template>
<script>
	import Cross from '../multiplex/Cross.vue'
	import IdentifyCode from './IdentifyCode.vue'
	import test from '../../api/Test.js'
	import myAjax from '../../api/ajax.js'
	import router from '../../router.js'

	export default {
		data:()=>{
			return {
				// 注册中
				registering: false,
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
				this.$emit('close');
			},
			// 验证用户名
			userNameTest(){
				// 密码错误清空
				this.password.msg = '';
				// 字符限制
				let characterRes = test.isCharacter(this.userName.inputValue);
				this.userName.isOk = characterRes[0];
				this.userName.msg = characterRes[1]; 
				if(characterRes[0]){
					// 长度限制
					let lengthRes = test.isLength(this.userName.inputValue, 3, 10);
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
				// 禁止再次提交
				this.registering = true;
				let that = this;
				// 格式信息是否都正确
				if(this.userName.isOk && this.password.isOk){
					// 等着验证码校验成功
					this.$refs.verifyCode.verify().then(res=>{
						// 这里做表单提交，登录
						myAjax.post('/mylogin',{'Content-type': 'application/x-www-form-urlencoded'},`username=${this.userName.inputValue}&password=${this.password.inputValue}`).then((value)=>{
							// 响应成功
							this.registering = false;
							// 解析
							let res = JSON.parse(value);
							if(res.code == -1){
								// 错误信息
								this.userName.msg = '用户不存在';
								// 其他错误清空
								this.password.msg = '';
							}else if(res.code == 1){
								// 登录成功，更新登录状态
								this.$root.$data.loged = true;
								this.$root.$data.username = this.userName.inputValue;
								// 关闭页面
								this.$emit('close');
							}else if(res.code == 0){
								this.userName.msg = '';
								this.password.msg = '密码错误';
							}
						});
					},errmsg=>{
						// 验证码错误
						that.verify.msg = errmsg;
						// 再次编辑
						this.registering = false;
					});
				}else{
					// 禁止再次提交
					this.registering = false;
					window.alert('请输入完整');
				}
			},
			// 去注册
			toregister(){
				this.$emit('toregister');
			}
		}
	}
</script>
<style scoped>
	.login{
		border: 2px solid black;
		position: fixed;
		padding: 42px 20px 20px;
		margin-top: 5px;
		left: 50%;
		transform: translateX(-50%);
		background-color: white;
		z-index: 20;
	}
	.login .registering{
		pointer-events: none;
		background-color: gray !important;
	}
	.login .registeringmsg{
		position: absolute;
		color: white;
		border-radius: 20px;
		top: 50%;
		left: 50%;
		width: 50%;
		height:60px;
		line-height: 60px;
		text-align: center;
		transform: translate(-50%, -50%);
		background-color: rgba(0,100,250, 0.8);
	}
	.form{
		text-align: center;
		padding: 20px;
	}
	.form .ipt{
		text-align: bottom;
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
		color: black;
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
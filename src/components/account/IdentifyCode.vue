<template>
	<div class="identifyCode">
		<input type="text" placeholder="验证码" v-model="inputValue" @input="updateMsg">
		<img v-bind:src="imgSrc" alt="点击刷新" v-debounce:click="refresh">
	</div>
</template>
<script>
	import myAjax from '../../functions/ajax.js'
	import urls from '../../functions/urls.js'
	export default{
		data: ()=>{
			return {
				imgSrc: '', // 验证码图像url
				captcha_id: '', // 验证码id
				inputValue: '', // 用户输入
			};
		},
		created(){
			// 验证码初始化
			this.refresh();
		},
		methods:{
			// 更新校验提醒
			updateMsg(){
				// 更新父组件提示信息
				this.$emit('update', '');
			},
			// 验证码刷新
			refresh(){
				const url = `${urls.verifyImgUrl}&return_format=data`;
				let that = this;
				// 图片刷新
				myAjax.get(url).then(res=>{
					let obj = JSON.parse(res);
					that.captcha_id = obj.data.captcha_id;
					let base64 = obj.data.captcha_img;
					that.imgSrc=`data:image/png;base64,${base64}`;
				});
				// 更新校验提醒
				this.updateMsg();
			},
			// 提交按钮触发验证码校验。父组件通过refs调用
			verify(){
				let that = this;
				// 校验请求
				return new Promise((resolve,reject)=>{
					let url = `${urls.verifyUrl}&captcha_id=${this.captcha_id}&captcha_code=${this.inputValue}`;
					// 开始校验
					myAjax.get(url).then(res=>{
						let obj = JSON.parse(res);
						let answer = obj.data.err_code;
						let msg = ''; // 验证信息
						// 0，校验成功，1验证码过期，2验证码错误
						if(answer == 0){
							msg = '正确';
							// 校验成功
							resolve();
						}else if(answer == 1){
							msg = '验证码过期';
						}else if(answer == 2){
							msg = '验证码错误';
							that.refresh();
						}
						// 失败，返回校验信息
						reject(msg);
					});
				});
			}
		}
	}
</script>
<style scoped>
	.identifyCode{
		text-align: left;
	}
	input{
		box-sizing: border-box;
		width: 50%;
		height: 100%;
		vertical-align: top;
	}
	img{
		vertical-align: top;
		float: right;
		width: 40%;
		height: 100%;
	}
	img:hover{
		cursor: pointer;
	}
</style>
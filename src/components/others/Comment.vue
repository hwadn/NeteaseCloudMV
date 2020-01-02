<template>
	<div class="comment">
		<div class="add">
			<textarea v-if="this.$root.$data.loged" v-model="textinput" cols="30" rows="4" @focus="isInput=true;submitState=''" placeholder="发表评论"></textarea>
			<div class="to-login" v-if="!this.$root.$data.loged">请<span class="login" @click="toLogin">登录</span>留言</div>
			<div class="submit" v-if="isInput">
				<span style="color:red;margin-right:30px;" v-show="submitState.length!=0">{{submitState}}</span>
				<span v-if="restLimit >= 0">还能输入<span>{{restLimit}}</span>个字符</span>
				<span v-if="restLimit < 0" class="warn">超出<span>{{-restLimit}}</span>个字符，无法发表！</span>
				<button class="publish" v-debounce:click="submit" :disabled="restLimit < 0">发表</button>
			</div>
		</div>
		<div class="lists" v-if="records.length > 0">
			<ul>
				<li v-for="(item, index) in records">
					<div class="header">
						<span class="order">{{index+1}}</span>楼
						<span class="name" :class="{active: getLoginedUsername == item.username}">{{item.username}}</span>
						<span class="delete" v-if="getLoginedUsername == item.username" @click="remove(item.id)">删除</span>
						<span class="time">{{timeFormate(item.time)}}</span>
					</div>
					<div class="message">{{item.comment}}</div>
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
	import myAjax from '../../functions/ajax.js'
	import eventBus from '../../functions/eventBus.js'
	export default {
		data: ()=>{
			return {
				// 评论内容
				textinput: '',
				// 是否输入了
				isInput: false,
				// 发表字数限制
				wordsLimit: 200,
				// 发表成功提醒
				submitState: '',
				records: [],
				// currentUsername: '',
			};
		},
		mounted(){
			this.read();
		},
		methods: {
			// 读取留言
			read(){
				// 请求评论数据
				myAjax.get('/comments.json').then((value)=>{
					let responseObj = JSON.parse(value);
					this.records = responseObj;
				});
			},
			// 发表评论
			submit(){
				// 不能发表空的
				if(!/\S/.test(this.textinput)){
					this.submitState = '不能发表空内容';
					return;
				}
				let url = `/record/add`;
				let header = {'Content-type': 'application/x-www-form-urlencoded'};
				let body = `username=${this.$root.$data.username}&comment=${this.textinput}`;
				// 发表成功
				myAjax.post(url, header, body).then(value=>{
					let response = JSON.parse(value);
					// 发表成功
					if(response.code == 1){
						this.submitState = '发表成功！';
						this.textinput = '';
						this.read();
						let that = this;
						setTimeout(function(){
							that.submitState = '';
						},2000);
					}else{
						// 发表失败
						this.submitState = '发表失败';
					}
				});
			},
			// 时间格式化
			timeFormate(sqlTime){
				let timearr = sqlTime.split('/');
				let time = `${timearr[0]}年${timearr[1]}月${timearr[2]}日  ${timearr[3]}:${timearr[4]}`;
				return time;
			},
			// 删除
			remove(id){
				let url = `/record/remove`;
				let header = {'Content-type': 'application/x-www-form-urlencoded'};
				let body = `id=${id}`;
				// 删除评论
				myAjax.post(url, header, body).then(value=>{
					let response = JSON.parse(value);
					// 发表成功
					if(response.code == 1){
						this.submitState = '删除成功！';
						let that = this;
						setTimeout(function(){
							that.submitState = '';
						},1000);
						// 更新留言
						this.read();
					}else{
						// 发表失败
						this.submitState = '删除失败';
					}
				});
			},
			// 登录
			// 登录界面显示
			toLogin(){
				eventBus.$emit('showLogin');
			},
		},
		computed: {
			// 剩余字数
			restLimit(){
				return this.wordsLimit - this.textinput.length;
			},
			// 登录名
			getLoginedUsername(){
				// if(this.$root.$data)console.log('ook');
				return this.$root.$data.username || false;
			}
		}
	}
</script>
<style scoped>
	.comment{
		padding: 10px 15px;
		/*background-color: pink;*/
	}
	.add{
		/*background-color: violet;*/
		text-align: right;
	}
	.add textarea{
		display: inline-block;
		border-radius: 5px;
		width: 100%;
		box-sizing: border-box;
	}
	.add .to-login{
		padding: 10px;
		box-sizing: border-box;
		background-color:  gray;
		margin-bottom: 5px;
		text-align: center;
		color: white;
	}
	.add .to-login .login{
		padding: 0 5px;
		font-size: 1.2rem;
		color: blue;
		text-decoration: underline;
	}
	.add .to-login .login:hover{
		cursor: pointer;
	}
	.add .submit{
		font-size: 0.6rem;
		color: gray;
	}
	.add .submit .warn{
		color: red;
	}
	.add .submit .publish{
		margin-left: 10px;
		width: 80px;
		height: 30px;
		outline: none;
		border: none;
		border-radius: 5px;
		background-color: #99CCFF;
	}
	.add .publish:hover{
		cursor: pointer;
		color: white;
		background-color: #0066CC;
	}
	.add .publish:active{
		color: red;
	}
	.lists{
		margin-top: 20px
	}
	.lists ul{
		background-color: white;
		padding: 0;
		margin: 0;
		list-style-type: none;
		user-select: text;
	}
	ul li{
		padding: 5px 0 8px;
		border-bottom: 1px dashed rgba(100,100,100,0.3);
	}
	ul li:last-child{
		border: none;
	}
	ul li .header{
		padding: 2px 0;
		background-color: white;
		position: relative;
		font-size: 0.8rem;
	}
	li .header .order{
		color: gray;
	}
	li .header .name{
		font-size: 1rem;
		font-weight: bold;
		margin-left: 10px;
	}
	li .header .name.active{
		color: #33BB88;
	}
	li .header .delete{
		display: none;
		position: absolute;
		right: 150px;
		color: blue;
		user-select: none;
	}
	li:hover .delete{
		display: inline; 
	}
	li .header .delete:hover{
		cursor: pointer;
	}
	li .header .delete:active{
		color: red;
	}
	li .header .time{
		color: gray;
		position: absolute;
		right: 5px;
	}
	ul li .message{
		padding: 5px 0;
	}
</style>
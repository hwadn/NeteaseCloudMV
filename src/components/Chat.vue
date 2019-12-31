<template>
	<div class="chat">
		<div class="title">
			在线交流
			<span class="online-number">连接数：{{visitNumber}}</span>
		</div>
		<ul id="chat-stream">
			<li v-for="item in comments" :class="{selfmsg: isSelf(item.username)}">
				<span class="name" v-if="!isSelf(item.username)">{{item.username}}</span>
				<span class="content">{{item.content}}</span>
				<span class="name" v-if="isSelf(item.username)">{{item.username}}</span>
			</li>
		</ul>
		<div class="edit">
			<textarea v-if="this.$root.$data.loged" v-model="textarea" cols="30" rows="6" :placeholder="editWords"></textarea>
			<div class="to-login" v-if="!this.$root.$data.loged">请<span class="login" @click="toLogin">登录</span>参与交流</div>
			<div class="btns">
				<button @click="submit">发送</button><button @click="textarea=''">撤销</button>
			</div>
		</div>
	</div>
</template>
<script>
	import urls from '../api/urls.js'
	import eventBus from '../api/eventBus.js'
	export default {
		data: ()=>{
			return {
				socket: null,
				visitNumber: 0,
				comments: [],
				textarea: '',
				editWords: '请编辑',
			};
		},
		created(){
			// websocket
			let that = this;
			this.socket = new WebSocket("ws://localhost:8001/");
			// 监听接收消息
			this.socket.onmessage = function(event){
				let data = JSON.parse(event.data);
				// 实时访问量
				if(data.type == 'visit'){
					that.visitNumber = data.number;
				}else if(data.type == 'msg'){
					// 评论
					let item = {
						username : data.username,
						content : data.content
					};
					// 接收到消息
					that.$set(that.comments, that.comments.length, item);
				}
			};
		},
		mounted(){
			let that = this;
			// 页面卸载
			window.onbeforeunload = function(){
				// 关闭连接
				that.socket.close();
			}
			// 断网，关闭连接
			window.onoffline = function() {
				that.socket.close();
			}
		},
		// 组件更新完，聊天记录滚动到底部
		updated(){
			let ul = document.querySelector("#chat-stream");
			ul.scrollBy(0, ul.scrollHeight);
		},
		methods: {
			// 发送评论
			submit(){
				// 用户名，消息
				let username = this.$root.$data.username;
				let content = this.textarea;
				if(content == ''){
					this.editWords = '输入不能为空！！！';
				}else{
					this.editWords = '请编辑';
					let msg = {
						type: 'msg',
						username,
						content
					};
					this.socket.send(JSON.stringify(msg));
					this.textarea = '';
				}
			},
			// 是不是自己发的
			isSelf(currentName){
				return currentName == this.$root.$data.username;
			},
			// 登录界面显示
			toLogin(){
				eventBus.$emit('showLogin');
			},
		}
	}
</script>
<style scoped>
	.chat{
		padding: 0 5px;
		box-sizing: border-box;
		background-color: #336699;
	}
	.title{
		position: relative;
		color: white;
		text-align: center;
		font-size: 1rem;
		padding: 5px 0;
	}
	.title .online-number{
		color: yellow;
		font-size: 0.8rem;
		position: absolute;
		display: inline-block;
		right: 5px; 
		bottom: 2px;
	}
	ul{
		background-color: white;
		height: 320px;
		overflow-y: auto;
		padding: 0 0 10px;
		margin: 0;
		list-style-type: none;
		background-color: #F5F5F5;
	}
	ul li{
		margin: 5px 2px;
		padding: 2px 5px;
		font-size: 0.8rem;
	}
	ul li.selfmsg{
		text-align: right;
	}
	ul li.selfmsg .name{
		background-color: #C1FFC1;
	}
	ul li .name{
		display: inline-block;
		padding: 2px 5px;
		margin-bottom: 2px;
		border-radius: 50%;
		background-color: #FFFF99;
	}
	ul li .content{
		display: inline-block;
		padding: 2px 10px;
		border-radius: 3px;
		background-color: white;
		border: 1px solid black;
	}
	.edit{
		margin: 5px 0;
	}
	.edit textarea{
		display: inline-block;
		width: 100%;
		box-sizing: border-box;
	}
	.edit .to-login{
		height: 100px;
		box-sizing: border-box;
		background-color:  #F5F5F5;
		margin-bottom: 5px;
		text-align: center;
		line-height: 100px;
	}
	.edit .btns{
		text-align: center;
		vertical-align: middle;
	}
	.edit .to-login .login{
		padding: 0 5px;
		font-size: 1.2rem;
		color: blue;
		text-decoration: underline;
	}
	.edit .to-login .login:hover{
		cursor: pointer;
	}
	.edit .btns button{
		background-color: white;
		outline: none;
		color: black;
		border: none;
		width: 60px;
		height: 30px;
		padding: 2px 5px;
		margin-right: 20px;
		user-select: none;
	}
	.edit .btns button:hover{
		cursor: pointer;
		background-color: rgb(240,240,240);
	}
	.edit .btns button:active{
		color: red;
	}
</style>
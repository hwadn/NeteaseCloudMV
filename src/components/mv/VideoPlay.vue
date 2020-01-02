<template>
	<transition name="fade">
		<div class="video-play" v-show="isShow">
			<video id="video" :src="currentUrl" :poster="currentPoster" controls preload autoplay controlslist="nodownload"></video>
			<span class="state" v-show="!canplay && currentUrl">{{error}}</span>
			<Cross :class="{white: true}" @click.native="close"></Cross>
			<div class="zoom">
				<span @click="amplify">+</span> 缩放 <span @click="reduce">-</span>
			</div>
		</div>
	</transition>
</template>
<script>
	import Cross from '../multiplex/Cross.vue'
	import eventBus from '../../functions/eventBus.js'
	import urls from '../../functions/urls.js'
	import myAjax from '../../functions/ajax.js'
	import dragMove from '../../functions/dragMove.js'

	export default {
		data: ()=>{
			return {
				currentUrl: '',
				currentPoster: '',
				canplay: false,
				error: '',
				isShow: false,
			};
		},
		components: {
			Cross,
		},
		mounted(){
			// 拖动事件
			let videoPlay = document.querySelector('.video-play');
			// 设置videozaidocument内拖动
			dragMove.addElement(document, videoPlay);
			// 监听其他组件传来的播放事件
			eventBus.$on('play', (id,cover)=>{
				this.isShow = true;
				this.setUrlById(id);
				this.currentPoster = cover;
			});
			// 定时监听网络状态
			let video = document.getElementById("video");
			// 设置音量
			video.volume = 0.2;
			let that = this;
			video.oncanplay = function(){
				// 是否可以播放
				that.canplay = true;
			};
			// 出现错误
			video.onerror = function(){
				that.canplay = false;
				let code = video.error.code;
				switch(code){
					case 1:
						that.error = '取回过程被中止';
						break;
					case 2:
						that.error = '下载发生错误';
						break;
					case 3:
						that.error = '解码发生错误';
						break;
					default:
				}
			};
		},
		methods: {
			// 获取视频地址并设置
			setUrlById(id){
				let url = `${urls.nodeUrl}/mv/url?id=${id}`;
				myAjax.get(url).then((str)=>{
					let obj = JSON.parse(str);
					if(obj.code == 200){
						this.currentUrl = obj.data.url;
					}
				});
			},
			// 右上角的叉
			close(){
				this.isShow = false;
				// 不再播放
				this.currentUrl = '';
			},
			// 放大
			amplify(){
				let videoPlay = document.querySelector('.video-play');
				let rect = videoPlay.getBoundingClientRect();
				let width = rect.width;
				if(width >= window.innerWidth)return;
				videoPlay.style.width = Math.floor(width*1.1) + 'px';
			},
			// 缩小
			reduce(){
				let videoPlay = document.querySelector('.video-play');
				let rect = videoPlay.getBoundingClientRect();
				let width = rect.width;
				if(width < 200)return;
				videoPlay.style.width = Math.floor(width*0.9) + 'px';
			},
		},
	}
</script>
<style scoped>
	.fade-enter{
		opacity: 0;
	}
	.fade-enter-active{
		transition: opacity 1s;
	}
	.video-play{
		font-size: 0;
		padding-top: 1.5rem;
		background: linear-gradient(black, gray 1.5rem);
	}
	#video{
		width: 100%;
	}
	#video:hover{
		cursor: pointer;
	}
	.video-play:hover{
		cursor: move;
	}
	.video-play:hover .cross{
		display: block;
	}
	.state{
		font-size: 1rem;
		display: inline-block;
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		color: red;
	}
	.cross{
		font-size: 1rem;
		display: none;
	}
	.zoom{
		display: none;
		font-size: 1rem;
		position: absolute;
		top: 0;
		left: 10px;
		color: white;
		user-select: none;
	}
	.zoom:hover{
		cursor: default;
		user-select: none;
	}
	.zoom span{
		cursor: pointer;
		display: inline-block;
		width: 1rem;
		background-color: rgb(0,100,255); 
		text-align: center;
		border-radius: 50%;
	}
	.zoom span:hover{
		background-color: rgba(10,150,255);
	}
	.zoom span:active{
		color: black;
	}
	.video-play:hover .zoom{
		display: inline-block;
	}
</style>
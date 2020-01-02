<template>
	<div class='recommend'>
		<div class="carousel" v-on:click="play">
			<div v-for="(mv,index) in mvs" :key="index">
				<transition name="move">
					<img v-bind:src="mv.picUrl" v-show="isShows[index]">
				</transition>
			</div>
		</div>
		<div class="description">
			<div class="name">{{current.name}}</div>
			<div class="artists">{{current.artists}}</div>
		</div>
		<div class="clicks" @click.stop="goMV">
			<span :class="{active:isShows[0]}">1</span>
			<span :class="{active:isShows[1]}">2</span>
			<span :class="{active:isShows[2]}">3</span>
			<span :class="{active:isShows[3]}">4</span>
		</div>
	</div>
</template>
<script>
	import myAjax from '../../functions/ajax.js'
	import deepCopy from '../../functions/deepCopy.js'
	import Vue from 'vue'
	import urls from '../../functions/urls.js'
	import eventBus from '../../functions/eventBus.js'

	export default{
		data: ()=>{
			return {
				isShows: [false, false, false, true], // 循环左移做轮播图
				mvs: [],
				current: {
					id: '',
					cover: '',
					name: '',
					artists: '',
				},
				timeInterval: null,
			};
		},
		methods: {
			// 创建数据
			dataCreate(){
				// 期望对象
				const mvMsg = {
						id: '',
						name: '',
						picUrl: '',
						artists: []
				};
				for( let i = 0; i < 4; i ++){
					// 深拷贝
					let curMv = deepCopy(mvMsg);
					Vue.set(this.mvs, i, curMv); 
				}
			},
			// 初始化数据
			dataInit(result){
				for(let i=0;i<result.length;i++){
					this.mvs[i].id = result[i].id;
					this.mvs[i].name = result[i].name;
					this.mvs[i].picUrl = result[i].picUrl;
					this.mvs[i].artists = result[i].artists;
				}
			},
			// 循环移动1位，默认左移
			arrShift(arr,isRight){
				isRight ? arr.unshift(arr.pop()) : arr.push(arr.shift());
			},
			// 处理作者数组，合并为字符串
			artists2str(artists){
				let res = '';
				for(let index in artists){
					res = res.concat(artists[index].name);
				}
				return res;
			},
			// 设置当前mv信息
			setCurrent(n){
				this.current.id = this.mvs[n].id;
				this.current.cover = this.mvs[n].picUrl;
				this.current.name = this.mvs[n].name;
				this.current.artists = this.artists2str(this.mvs[n].artists);
			},
			// 轮播按钮点击跳转
			goMV(event){
				if(event.target.nodeName != 'SPAN') return;
				// 设置显示mv
				let spanIndex = event.target.innerHTML;
				for(let i=0;i<this.isShows.length;i++){
					if(i == spanIndex-1){
						Vue.set(this.isShows, i, true);
					}else{
						Vue.set(this.isShows, i, false);
					}
				}
				// 设置当前mv信息
				this.setCurrent(spanIndex-1);
				// 定时器重启
				clearInterval(this.timeInterval);
				this.setCarrousel(5000);
			},
			// 轮播定时
			setCarrousel(wait){
				// 轮播定时， 间隔5s
				this.timeInterval = setInterval(()=>{
					// 循环左移
					this.arrShift(this.isShows);
					// 设置当前mv信息
					this.setCurrent(this.isShows.indexOf(true));
				},wait);
			},
			// 去播放
			play(){
				// 传给父组件去播放
				eventBus.$emit('play',this.current.id,this.current.cover);
			},
		},
		created(){
			// 创建数据
			this.dataCreate();
			// 显示初始化
			this.mvs[0].isShow = true;
			let that = this;
			myAjax.get(`${urls.nodeUrl}/personalized/mv`).then(value=>{
				let dataObj = JSON.parse(value);
				if(dataObj.code == 200){
					// 初始化数据
					that.dataInit(dataObj.result);
					// 设置当前mv信息
					this.setCurrent(this.isShows.indexOf(true));
				}else{
					window.console.log('响应失败:'+dataObj.code );
				}
			},err=>{
				window.console.log(err);
			});
		},
		mounted(){
			// 轮播定时5s
			this.setCarrousel(5000);
		}
	}
</script>
<style scoped>
	/* 适应设备宽度 */
	@media (max-width: 400px){
		.recommend {
			height: 134px !important;
		}
	}
	@media (min-width: 400px) and (max-width: 500px) {
		.recommend {
			height: 167px !important;
		}
	}
	@media (min-width: 500px) and (max-width: 600px) {
		.recommend {
			height: 200px !important;
		}
	}
	@media (min-width: 600px) and (max-width: 700px) {
		.recommend {
			height: 234px !important;
		}
	}
	@media (min-width: 700px) and (max-width: 800px) {
		.recommend {
			height: 267px !important;
		}
	}
	@media (min-width: 800px) and (max-width: 900px) {
		.recommend{
			height: 300px !important;
		}
	}
	@media (min-width: 900px) and (max-width: 1000px) {
		.recommend {
			height: 333px !important;
		}
	}
	@media (min-width: 1000px) and (max-width: 1100px) {
		.recommend{
			height: 366px !important;
		}
	}
	.recommend{
		font-size: 0;
		position: relative;
		margin-bottom: 5px;
		height: 400px;
	}
	.carousel{
		position: absolute;
		display: inline-block;
		font-size: 1rem;
		width: 100%;
		height: 100%;
		background-color: brown;
		overflow: hidden;
	}
	.carousel img{
		position: absolute;
		vertical-align: bottom;
		width: 100%;
		height: 100%;
	}
	.carousel img:hover{
		cursor: pointer;
	}
	.description{
		position: absolute;
		font-size: 1rem;
		box-sizing: border-box;
		margin-top: 2rem;
		background-color: rgba(0,0,0,0.3);
		left: 50%;
		transform: translateX(-50%);
		text-align: center;
		color: white;
	}
	.description .name{
		font-size: 1.2rem;
		padding: 0 1rem;
	}
	.description .artists{
		padding: 0 0.8rem;
		font-size: 0.8rem;
		line-height: 0.8rem;
	}
	.clicks{
		position: absolute;
		bottom: 10px;
		text-align: center;
		user-select: none;
		font-size: 1rem;
		left: 50%;
		transform: translateX(-50%);
	}
	.clicks span{
		color: white;
		text-align: center;
		padding: 0 0.625rem;
		margin-right: 0.125rem;
		background-color: rgba(100,100,100,0.5);
		user-select: none;
	}
	.clicks span::last-child{
		margin-right: 0;
	}
	.clicks span:hover{
		cursor: pointer;
	}
	.clicks span.active{
		color: black;
		background-color:rgba(255, 255, 102,0.8);
	}
	.move-enter-active, .move-leave-active{
		transition: transform 0.3s
	}
	.move-enter{
		transform: translateX(100%);
	}
	.move-leave-to{
		transform: translateX(-100%);
	}
</style>
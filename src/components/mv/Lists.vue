<template>
	<div class="lists">
		<ul id="mvs" @click="play">
			<li v-for="(mv, index) in currentMvs" :key="index">
				<Cover :img-url="mv.cover" :play-count="mv.playCount" :duration="mv.duration"></Cover>
				<div class="name">
					{{mv.name}}
				</div>
				<div class="artists">{{artists2Str(mv.artists)}}</div>
			</li>
		</ul>
		<div class="page-selector">
			<span :class="{active: isDisableLastPage}" class="page-click"  v-debounce:click="lastPage">上一页</span>
			<input @keyup.enter="jumpPage" type="text" v-bind:value="currentPage"><span> / {{this.pageNumber}}</span>
			<span :class="{active: isDisableNextPage}" class="page-click" v-debounce:click="nextPage">下一页</span>
		</div>
	</div>
</template>
<script>
	import Cover from './Cover.vue'
	import MyAjax from '../../functions/ajax.js'
	import urls from '../../functions/urls.js'
	import deepCopy from '../../functions/deepCopy.js'
	import ms2Time from '../../functions/ms2Time.js'
	import {throttle, debounce} from '../../functions/debounce.js'
	import Vue from 'vue'
	import artists2Str from '../../functions/artists2str.js'
	import eventBus from '../../functions/eventBus.js'

	export default {
		components: {
			Cover
		},
		props: {
			// 首次加载mv数量， 默认4
			firstLoadNumber: {
				type: String,
				default: 4
			},
			// 懒加载位置：距离浏览器底部距离，（单位：px。默认0）
			lazyLoadHeight: {
				type: String,
				default: 0
			},
			// 单页面mv数量，默认30
			singlePageNumber: {
				type: String,
				default: 30
			},
		},
		data: ()=>{
			return {
				// mv总数量，分组用到
				total: 0,
				// 当前页
				currentPage: 1,
				// 存放已加载的mv信息
				currentMvs: [],
				// 切页时滚动到顶部位置
				ulScrollTop: 0,
			};
		},
		// 监听页数
		watch: {
			// 页数发送变化则重新加载
			currentPage: function(){
				// 页面滚动到开头
				window.scrollTo(0,this.ulScrollTop-20);
				// 重新加载
				this.loadInit(this.singlePageNumber,this.firstLoadNumber);
			}
		},
		created(){
			// 首次加载初始化
			this.loadInit(this.singlePageNumber, this.firstLoadNumber);
		},
		mounted(){
			// 懒加载处理函数，节流，最快100ms执行1次
			const lazyLoadHandler = throttle(()=>{
				// 懒加载监听
				this.lazyLoad();
			}, 100);
			// 监听滚动事件
			window.addEventListener('scroll', lazyLoadHandler);
			// 获取ul顶部位置，滚动置顶用
			let ul = document.querySelector('#mvs');
			this.ulScrollTop = ul.getBoundingClientRect().top;
		},
		computed: {
			// 计算多少页
			pageNumber(){
				return Math.ceil(this.total / Number(this.singlePageNumber));
			},
			// 翻页按钮失效与否
			isDisableLastPage(){
				return this.currentPage == 1;
			},
			isDisableNextPage(){
				return this.currentPage == this.pageNumber;
			}
		}, 
		methods: {
			// 作者转换
			artists2Str,
			// mv加载初始化。单页mv多少个，加载多少个
			loadInit(singlePageNumber, firstLoadNumber){
				singlePageNumber = Number(singlePageNumber);
				firstLoadNumber = Number(firstLoadNumber);
				// 如果当前mvs存在就删掉，为切页做准备
				if(this.currentMvs.length > 0)this.currentMvs = [];
				// mv数据初始模板
				const mvMsg = {
					id: '',
					realCover: '', // 真正url
					cover: '/placeholder.gif', // 占位图
					playCount: 0,
					duration: '',
					name: '',
					artists: []
				};
				// 1次请求单页所有mv信息，img用占位图表示，防止未浏览就请求多次
				// 偏移量（当页mv在总mv中的位置）=（当前页数-1）*单页个数
				let offset = (this.currentPage - 1) * singlePageNumber;
				const mvUrl = `${urls.nodeUrl}/mv/all?limit=${singlePageNumber}&offset=${offset}`;
				MyAjax.get(mvUrl).then(mvsStr=>{
					// 解析
					let mvsObj = JSON.parse(mvsStr);
					let mvs = mvsObj.data;
					// 首页请求才存在，才会给总页数赋值
					if(mvsObj.count){
						this.total = mvsObj.count;
					}
					// 初始加载个数
					for( let i = 0; i < mvs.length; i++){
						let mv = mvs[i];
						// 深拷贝初始数据对象
						let curMv = deepCopy(mvMsg);
						// 给数据赋值
						curMv.id = mv.id;
						// 首次加载初始化
						if(i < firstLoadNumber){
							curMv.cover = mv.cover
						}
						curMv.realCover = mv.cover;
						curMv.playCount = mv.playCount;
						curMv.duration = ms2Time(mv.duration);
						curMv.name = mv.name;
						curMv.artists = mv.artists;
						Vue.set(this.currentMvs, i, curMv);
					}
				},err=>{
					window.console.log('mv请求失败: ' + err);
				});
			},
			// 懒加载方法 
			// 找出未加载的mv索引
			findUnload(){
				let indexArr = [];
				this.currentMvs.forEach((mv,index)=>{
					// 仍是占位图的img
					if(/(\/placeholder.gif)$/.test(mv.cover))indexArr.push(index);
				});
				return indexArr;
			},
			// 懒加载，计算图片列表元素li顶部距浏览器底部距离计算，达到视口位置就替换
			lazyLoad(){
				// ul的子元素
				let mvs = document.getElementById('mvs');
				if(!mvs)return;
				let lis = mvs.children;
				// 找到未加载的图片下标数组
				let unLoadArr = this.findUnload();
				// 遍历符合位置条件的，替换url进行加载
				Array.from(lis).forEach((li, index)=>{
					// 找到未加载的li
					if(unLoadArr.indexOf(index) != -1){
						let offsetBottom = this.topWindowBottom(li);
						// 如果图片出现在浏览器视口内，就替换其中的url
						if(-this.lazyLoadHeight-window.innerHeight < offsetBottom && offsetBottom < this.lazyLoadHeight){
							// 把cover换成真实url
							let currentMv = this.currentMvs[index];
							currentMv.cover = currentMv.realCover;
						}
					}
				});
			},
			// 计算元素顶部距浏览器底部距离
			topWindowBottom(ele){
				let rectObject = ele.getBoundingClientRect();
				let bottomToWindowTop = rectObject.top;
				// 元素距浏览器底部懒加载线位置。>0超过，<0不到。
				return (bottomToWindowTop - window.innerHeight);
			},
			// 上一页
			lastPage(){
				if(this.currentPage <= 1)return;
				this.currentPage --;
			},
			// 下一页，防抖100ms
			nextPage(){
				if(this.currentPage >= this.pageNumber)return;
				this.currentPage ++;
			},
			// 输入是enter是执行
			jumpPage(event){
				let newPage = event.target.value;
				if(0 < newPage && newPage <= this.pageNumber){
					this.currentPage = newPage;
				}
			},
			// 去播放视频
			play(event){
				let node = event.target;
				// 事件委托
				if(node.nodeName == 'LI'){
					let ul = node.parentNode;
					// 获取所以的li集合
					let lis = ul.children;
					// 获取当前点击li在ul中的位置坐标
					let index = Array.from(lis).indexOf(node)
					// 计算当前li的id和cover
					let id = this.currentMvs[index].id;
					let cover = this.currentMvs[index].realCover;
					// 去播放
					eventBus.$emit('play',id, cover);
				}
			},
		}
	}
</script>
<style scoped>
	ul{
		list-style-type: none;
		padding: 10px 10px 0;
		margin: 0;
		background-color: white;
		font-size: 0;
	}
	li{
		font-size: 1rem;
		box-sizing: border-box;
		margin-bottom: 1.2rem;
		background-color: white;
		display: inline-block;
		width: 50%;
	}
	li:nth-child(even){
		padding-left: 5px;
	}
	li:nth-child(odd){
		padding-right: 5px;
	}
	li:hover{
		cursor: pointer;
	}
	li .cover{
		/*禁止事件*/
		pointer-events: none;
	}
	li .name{
		margin-top: 0.3rem;
		font-size: 0.8rem;
		height: 1rem;
		padding: 2px;
		line-height: 1rem;
		white-space:nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		/*禁止事件*/
		pointer-events: none;
	}
	li .artists{
		color: gray;
		padding: 2px;
		font-size: 0.6rem;
		height: 0.8rem;
		line-height: 0.8rem;
		white-space:nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		/*禁止事件*/
		pointer-events: none;
	}
	.lists .page-selector{
		padding: 5px;
		text-align: center;
	}
	.lists input{
		width: 30px;
		text-align: center;
		vertical-align: text-bottom;
	}
	.lists .page-click{
		user-select: none;
		display: inline-block;
		margin: 0 20px;
		padding: 5px 15px;
		border: 1px solid rgba(100,100,100,0.5);
	}
	.lists .page-click:hover{
		cursor: pointer;
		border: 1px solid blue;
		background-color: #ccffff;
	}
	.lists .page-click:active{
		color: red;
	}
	.lists .page-click.active{
		border: none;
		background-color: rgba(100,100,100,0.2);
		/*禁止点击*/
		pointer-events: none;
	}
</style>
<template>
	<div class="all">
		<Recommend></Recommend>
		<ul>
			<li v-for="index in 5" :key="index">
				<Cover img-url="/test.jpeg" play-count="1233" duration="01:30"></Cover>
				<div class="name">
					{{imgMsg.name}}
				</div>
			</li>
		</ul>
	</div>
</template>
<script>
	import Recommend from './Recommend.vue'
	import Cover from './Cover.vue'
	export default {
		data: ()=>{
			return {
				imgMsg: {
					name: '爱的供养'
				}
			};
		},
		components: {
			Recommend,
			Cover
		}
	}
</script>
<style scoped>
	.recommend{
		background-color: #E0F8F7;
	}
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
	li img{
		width: 100%;
	}
	li .name{
		margin-top: 0.3rem;
		font-size: 0.8rem;
		height: 1rem;
		line-height: 1rem;
	}
</style>
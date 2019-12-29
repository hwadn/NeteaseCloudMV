<template>
	<div class="mv">
		<VideoPlay></VideoPlay>
		<div class="bar">
			<router-link to="/all">全部</router-link>
			<router-link to="/board">排行</router-link>
			<router-link to="/new">最新</router-link>
		</div>
		<router-view class="show"></router-view>
	</div>
</template>
<script>
	import VideoPlay from './mv/VideoPlay.vue'

	export default{
		components: {
			VideoPlay,
		},
	}
</script>
<style scoped>
	/*屏幕尺寸适应*/
	@media (max-width: 800px) {
		.video-play{
			width: 70% !important;
			left: 0 !important;
		}
	}
	@media (max-width: 600px) {
		.video-play{
			width: 100% !important;
			left: 0 !important;
		}
	}
	.mv{
		width: 100%;
	}
	.video-play{
		position: fixed;
		width: 30%;
		left: 20px;
		top: 50px;
		z-index: 10;
	}
	.drag-zoom{
		position: fixed;
		left: 100px;
		top: 50px;
		z-index: 100;
	}
	.bar{
		height: 2.5rem;
		line-height: 2.5rem;
		font-size: 0;
		background-color: #336699;
	}
	.bar a{
		text-decoration: none;
		color: white;
		display: inline-block;
		width: 5rem;
		text-align: center;
		font-size: 1rem;
	}
	.bar .router-link-active{
		color: #FFFF99;
		font-size: 1.125rem;
	}
	.show{
		user-select: none;
	}
</style>
<template>
	<div class="mv">
		<div class="bar">
			<router-link to="/all">全部</router-link>
			<router-link to="/board">排行</router-link>
			<router-link to="/new">最新</router-link>
		</div>
		<router-view class="show"></router-view>
	</div>
</template>
<script>
	export default{

	}
</script>
<style scoped>
	.mv{
		width: 100%;
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
		padding: 5px 0;
	}
</style>
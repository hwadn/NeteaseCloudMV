<template>
	<div>
		<div class='head'>
			<Weather></Weather>
			<h3 class="title">网易云MV在线交流</h3>
			<account-info></account-info>
		</div>
		<div class="body">
			<MV></MV>
			<Chat></Chat>
		</div>
		<div class='footer'>
			联系邮箱：chd1994@foxmail.com
		</div>
	</div>
</template>
<script>
	import Weather from './components/Weather.vue'
	import AccountInfo from './components/account/AccountInfo.vue'
	import MV from './components/MV.vue'
	import Chat from './components/Chat.vue'
	export default {
		components:{
			Weather,
			AccountInfo,
			MV,
			Chat
		},
	};
</script>
<style>
	/*屏幕尺寸适应*/
	@media (max-width: 600px) {
		.account-info, .chat{
			display: none !important;
		}
		.mv{
			width: 100% !important;
		}
	}
	/*头部*/
	.head{
		height: 3.5rem;
		line-height: 3.5rem;
		text-align: center;
		background-color: rgb(34,34,34);
		color: white;
	}
	.head .weather{
		position: absolute;
		left: 5px;
		padding: 0 5px;
	}
	.head .title{
		display: inline;
	}
	.head .account-info{
		position: absolute;
		right: 1rem;
		z-index: 30;
	}
	/*主体*/
	.body{
		padding: 1rem 0.5rem;
		background-color: rgb(221,221,221);
	}
	.body .mv{
		width: 65%;
		display: inline-block;
		background-color: white;
		min-height: 540px;
	}
	.body .chat{
		position: fixed;
		display: inline-block;
		right: 5px;
		width: 34%;
	}
	/*脚部*/
	.footer{
		height: 2.8rem;
		font-size: 0.8rem;
		line-height: 2.8rem;
		background-color: black;
		color: white;
		text-align: center;
	}
</style>
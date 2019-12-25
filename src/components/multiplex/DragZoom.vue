<template>
	<div class="drag-zoom">
		<slot></slot>
	</div>
</template>
<script>
	export default {
		data: ()=>{
			return {
				// 缩放，拖放
				box: null, // 当前盒子node
				currentWidth: 0,
				currentHeight: 0,
			};
		},
		// 监听拖动，缩放事件
		watch: {
			currentWidth: function(){
				this.box.style.width = (typeof this.currentWidth == "string") ? this.currentWidth : `${this.currentWidth}px`;
			},
			currentHeight: function(){
				this.box.style.height = (typeof this.currentHeight == "string") ? this.currentHeight : `${this.currentHeight}px`;
			},
		},
		mounted(){
			this.box = document.querySelector('.drag-zoom');
			// 初始高度，宽度
			this.currentWidth = '30%';
			this.currentHeight = 300;
		},
	}
</script>
<style scoped>
	.drag-zoom{
		background-color: pink;
	}
</style>
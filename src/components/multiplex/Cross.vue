<template>
	<div class="cross"></div>
</template>
<style scoped>
	.cross{
		position: absolute;
		top: 0;
		right: 0;
		width: 32px;
		height: 32px;
	}
	.cross:before, .cross:after{
		content: '';
		position: absolute;
		display: block;
		background-color: red;
		width: 32px;
		height: 2px;
		left: 0;
		top: 15px;
	}
	.cross:hover:before, .cross:hover:after{
		outline: yellow solid 1px;
	}
	.cross:before{
		transform: rotate(45deg);
	}
	.cross:after{
		transform: rotate(-45deg);
	}
</style>
<template>
	<div class="play-icon"></div>
</template>
<style scoped>
	.play-icon{
		display: inline-block;
		width: 0.8em;
		height: 0.8em;
		box-sizing: border-box;
		border: 0.4em solid rgba(0,0,0,0);
		border-right: 0.35em solid rgba(0,0,0,0);
		border-left: 0.65em solid rgba(255,255,255,0.9);
	}
	.play-icon.middle{
		width: 1.6em;
		height: 1.6em;
		border: 0.8em solid rgba(0,0,0,0);
		border-left: 1.3em solid rgba(255,255,255,0.9);
	}
	.play-icon.big{
		width: 3.2em;
		height: 3.2em;
		border: 1.6em solid rgba(0,0,0,0);
		border-left: 2.6em solid rgba(255,255,255,0.9);
	}
	.play-icon:hover{
		border-left-color: white;
	}
</style>
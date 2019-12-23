<template>
	<div class="cover">
		<img :src="imgUrl">
		<div class="info">
			<span class="count">
				<PlayIcon></PlayIcon>
				{{playCount}}
			</span>
			<span class="duration">
				<DurationIcon></DurationIcon>
				{{duration}}
			</span>
		</div>
	</div>
</template>
<script>
	import PlayIcon from '../multiplex/PlayIcon.vue'
	import DurationIcon from '../multiplex/DurationIcon.vue'
	export default{
		props: {
			imgUrl: '',
			playCount: Number,
			duration: String
		},
		components: {
			PlayIcon,
			DurationIcon
		},
	}
</script>
<style scoped>
	.cover{
		position: relative;
	}
	.cover img{
		border-radius: 0.6rem;
		width: 100%;
	}
	.info{
		box-sizing: border-box;
		padding: 0 1rem;
		font-size: 0.8rem;
		position: absolute;
		width: 100%;
		bottom: 0.8rem;
		color: white;
	}
	.info .count{
		float: left;
	}
	.info .duration{
		float: right;
	}
</style>
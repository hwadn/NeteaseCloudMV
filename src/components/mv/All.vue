<template>
	<div class="all">
		<Recommend></Recommend>
		<Lists first-load-number="4" single-page-number="30" lazy-load-height="200"></Lists>
	</div>
</template>
<script>
	import Recommend from './Recommend.vue'
	import Lists from './Lists.vue'
	export default {
		components: {
			Recommend,
			Lists
		}
	}
</script>
<style scoped>
	.recommend{
		background-color: #E0F8F7;
	}
</style>
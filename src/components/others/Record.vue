<template>
	<div class="record">
		<div class="add">
			<textarea v-model="textinput" cols="30" rows="3"></textarea>
			还能输入<span>{{wordsLimit}}</span>字<button>发表评论</button>
		</div>
		<div class="lists" v-if="total > 0">
			<ul>
				<li v-for="item in records">
					<div class="header">
						<span class="order">{{item.order}}</span>
						<span class="name">{{item.username}}</span>
						<span class="time">{{item.time}}</span>
					</div>
					<div class="message">{{item.message}}</div>
				</li>
			</ul>
			<div class="pages">
				第1页
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		data: ()=>{
			return {
				textinput: '',
				wordsLimit: 30,
				total: 1,
				singlePageNumber: 30,
				records: [{
					order: 1,
					username: 'chd',
					time: '2019年12月3日',
					message: '厉害',
				},{
					order: 2,
					username: 'chd',
					time: '2019年12月3日',
					message: '厉害',
				}],
			};
		},
		created(){
			this.records[1].message = '啊实打实哒哒哒哒哒哒多多多多多多多多多多多多多多多多多多多多多多多多多多多多撒大大多多多多多多多多多多多多多多多多多多多多多多多多多多多';
		},
	}
</script>
<style scoped>
	.record{
		padding: 10px;
		background-color: pink;
	}
	.add{
		background-color: violet;
		text-align: right;
	}
	.add textarea{
		display: inline-block;
		border-radius: 5px;
		width: 100%;
		box-sizing: border-box;
	}
	.lists{
		margin-top: 10px;
		background-color: yellow;
	}
	.lists ul{
		background-color: white;
		padding: 0;
		margin: 0;
		list-style-type: none;
	}
	ul li{
		padding: 5px 0;
		border-bottom: 1px dashed gray;
	}
	ul li .header{
		padding: 2px 0;
		background-color: white;
	}
	li .header .order{
		font-size: 0.8rem;
		color: gray;
	}
	li .header .name{
		font-weight: bold;
	}
	li .header .time{
		font-size: 0.8rem;
		color: gray;
	}
	ul li .message{
		padding: 5px 0;
		/*background-color: red;*/
	}
	.lists .pages{
		margin-top: 10px;
		background-color: green;
	}
</style>
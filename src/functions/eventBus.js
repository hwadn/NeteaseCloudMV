// import Vue from 'vue'
// const eventBus = new Vue();
function EventBus(){
	// 观察者集合
	this.watchers = {};
}
// 加入监听
EventBus.prototype.$on = function(eventName, fn){
	if(!this.watchers[eventName])this.watchers[eventName] = [];
	this.watchers[eventName].push(fn);
}
// 触发事件
EventBus.prototype.$emit = function(eventName){
	let args = Array.prototype.slice.call(arguments, 1);
	this.watchers[eventName].forEach(fn=>{
		fn.apply(null,args);
	});
}

export default new EventBus;
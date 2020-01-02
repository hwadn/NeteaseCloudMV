import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import {debounce, throttle} from './functions/debounce.js'

// 自定义指令
// 防抖
Vue.directive('debounce',{
	bind: function(el, binding){
		let fn = binding.value;
		let event = binding.arg;
		// 100ms
		el.addEventListener(event, debounce(fn, 100));
	}
});
// 节流，默认200ms。200ms后执行
Vue.directive('throttle',{
	bind: function(el, binding){
		let fn = binding.value;
		let event = binding.arg;
		// 100ms
		el.addEventListener(event, throttle(fn, 200));
	}
});


new Vue({
	router,
	data: {
		loged: false,
		username: ''
	},
	render: h => h(App)
}).$mount("#app");
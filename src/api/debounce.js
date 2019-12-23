// 防抖
function debounce(fn, wait){
	var flag = null;
	return function(event){
		clearTimeout(flag);
		flag = setTimeout(fn,wait);
	}
}
// 节流
function throttle(fn, wait){
	var flag = null;
	return function(){
		if(flag) return;
		flag = setTimeout(function(){
			fn();
			flag = null;
		}, wait);
	}
}

export {debounce, throttle}
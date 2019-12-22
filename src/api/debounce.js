// 防抖
function debounce(fn, wait){
	var flag = null;
	return function(event){
		clearTimeout(flag);
		flag = setTimeout(fn.bind(null, event),wait);
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
// 计算时长，毫秒转分钟等
function getTime(n){
	let seconds = Math.ceil(Number(n) / 1000);
	let minutes = Math.floor(seconds / 60);
	seconds = seconds % 60;
	if(minutes >= 60){
		var hours = Math.floor(minutes / 60);
		minutes = minutes % 60;
		if(hours < 10) hours = '0' + hours;
	}
	// 数字转字符串
	if(minutes < 10) minutes = '0' + minutes;
	if(seconds < 10) seconds = '0' + seconds;
	return hours ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
}

export {debounce, throttle}
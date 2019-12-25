// 计算时长，以秒为准转分钟等，默认ms
function ms2Time(n, times){
	(typeof n == 'number') || (n = Number(n));
	let seconds = Math.ceil(n / (times || 1000));
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

export default ms2Time
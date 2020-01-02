function artists2Str(artistaArr){
	let res = '';
	artistaArr.forEach((arr, index)=>{
		(index == artistaArr.length-1) ? res += arr.name : res += (arr.name + '/'); 
	});
	return res;
}

export default artists2Str;
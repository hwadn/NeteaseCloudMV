import Vue from 'vue'
function deepCopy(obj){
	let res = Array.isArray(obj) ? [] : {};
	for(let key in obj){
		if(obj.hasOwnProperty(key)){
			if(obj[key] instanceof Object && obj[key] != null){
				Vue.set(res, key, deepCopy(obj[key]));
			}else{
				Vue.set(res, key, obj[key]);
			}
		}
	}
	return res;
}

export default deepCopy;
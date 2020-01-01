// ajax结合，异步请求，做链式调用。默认get
// get请求
function get(url){
	return new Promise((resolve,reject)=>{
		let xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4){
				if(xhr.status == 200){
					resolve(xhr.responseText);
				}
			}
		}
		xhr.open('get',url,true);
		xhr.send(null);
	});
}
// post请求
// header对象形式
// body字符串形式
function post(url, header, body){
	return new Promise((resolve, reject)=>{
		let xhr  = new XMLHttpRequest();
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4){
				if(xhr.status == 200){
					resolve(xhr.responseText);
				}
			}
		};
		// 异步
		xhr.open('post', url, true);
		// 设置头部
		if(header){
			Object.keys(header).forEach(key=>{
				xhr.setRequestHeader(key, header[key]);
			});
		}
		// 发送主体
		body ? xhr.send(body) : xhr.send(null);
	});
}
const myAjax = {get, post};
export default myAjax;
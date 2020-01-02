// ajax结合，异步请求，做链式调用。默认get
// 兼容xhr对象
function createXHR(){
	if(typeof XMLHttpRequest != undefined){
		return new XMLHttpRequest();
	}else if(typeof ActiveXObject != undefined){
		var versions = ["MSXML2.XMLHttp.6.0","MSXML2.XMLHttp.3.0","MSXML2.XMLHttp"], i, len;
		for(i=0, len=versions.length; i < len; i++){
			try{
				new ActiveXObject(versions[i]);
				arguments.callee.activeXString = versions[i];
				break;
			}
			catch(err){}
		}
	}else{
		throw new Error('xhr不可用');
	}
}

// get请求
function get(url){
	return new Promise((resolve,reject)=>{
		let xhr =createXHR();
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
		let xhr  = createXHR();
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4){
				if(xhr.status == 200){
					resolve(xhr.responseText);
				}else{
					reject();
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
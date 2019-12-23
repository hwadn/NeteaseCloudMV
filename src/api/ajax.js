// ajax结合，异步请求
function myAjax(url){
	return new Promise((resolve,reject)=>{
		let xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4){
				if(xhr.status == 200){
					resolve(xhr.responseText);
				}else{
					reject('ajax请求失败: status=' + xhr.status);
				}
			}
		}
		xhr.open('get',url,true);
		xhr.send(null);
	});
}
export default myAjax;
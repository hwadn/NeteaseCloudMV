import myAjax from './ajax.js'
import urls from './urls.js'

// 获取ip所在城市
function getIpCity(){
	return new Promise((resolve,reject)=>{
		const url = urls.ipCityUrl;
		myAjax.get(url).then(str=>{
			let obj = JSON.parse(str);
			// 状态码
			let status = obj.ret;
			if(status == 200){
				// 传递ip所在城市
				let city = obj.data.data.city;
				// 去除市这个字
				city = city.substring(0, city.length-1);
				resolve(city);
			}
		},err=>{
			reject(err);
		});
	});
}
function getWeather(city){
	let ipCity = city;
	return new Promise((resolve,reject)=>{
		const url = `${urls.cityWeatherUrl}${ipCity}`;
		myAjax.get(url).then(str=>{
			let weatherMsg = JSON.parse(str);
			// 状态码
			let status = weatherMsg.ret;
			if(status == 200){
				resolve(str);
			}else{
				reject(status);
			}
		},err=>{
			reject(err);
		});
	});
}
function weatherMsg(){
	return new Promise((resolve,reject)=>{
		getIpCity().then(city=>{
			getWeather(city).then(weather=>{
				resolve(weather);
			},err=>{
				reject('天气信息获取失败:' + err);
			});
		},err=>{
			reject('ip城市获取失败'+err);
		});
	});
	
}
export default weatherMsg
// 校验``对象
function Test(){}
// 长度校验
Test.prototype.isLength = function(str,minLen,maxLen){
	if(str.length < minLen)return [false, '长度不够'];
	if(str.length > maxLen)return [false, '长度超出限制'];
	return [true, ''];
}
// 字符校验
Test.prototype.isCharacter = function(str){
	if(str.length == 0)return [false, '请输入用户名'];
	const regExp = /^(\d|[a-zA-Z])+$/;
	let isTrue = regExp.test(str);
	if(isTrue)return [true, ''];
	return [false, '含有非法字符'];
}

export default new Test();
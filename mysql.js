// 数据库
var mysql = require('mysql');
var connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : '2017022457',
	database :'account'
});

connection.connect();


// 注册，唯一性
function register(account){
	return new Promise((resolve,reject)=>{
		connection.query(`insert ignore into users values("${account.username}", "${account.password}")`, function (error, results, fields) {
			if(results.affectedRows == 0){
				// 用户名已存在，-1表示
				resolve('{"code":-1}');
			}else{
				// 注册成功，1表示
				resolve('{"code":1}');
			}
		});
	});
}
// 登录，用户名
function login(username){
	return new Promise((resolve,reject)=>{
		connection.query(`select password from users where name='${username}'`, function (error, results, fields) {
			// 没找到，用户不存在,-1表示
			if(results.length == 0){
				resolve('nothing');
			}else{
				// 用户存在，传给密码，做对比
				resolve(results[0].password);
			}
		});
	});
}
// 留言评论表操作
// 写入json
function writeJSONWithObj(jsonPath, obj){
	let fs = require('fs');
	let json = JSON.stringify(obj, null, 4);
	fs.writeFile(jsonPath, json, function(err, fd){
		if(err){
			console.log('更新json失败');
		}
	});
}
// 更新评论
function upDateJSON(jsonPath){
	connection.query(`select * from comments`, function (error, results, fields) {
		if(!results) {
			writeJSONWithObj
		}
		writeJSONWithObj(jsonPath, results);
	});
}
// 增加评论
function add(id, username, comment, time){
	return new Promise((resolve,reject)=>{
		connection.query(`insert comments values("${id}","${username}", "${comment}", "${time}")`, function (error, results, fields) {
			if(!results) resolve(-1);
			if(results.affectedRows == 1){
				// 操作成功
				// 更新json
				upDateJSON('./dist/comments.json');
				resolve(1);
			}else{
				// 数据库错误
				resolve(-1);
			}
		});
	});
}
// 删除评论
function deleteComent(id){
	return new Promise((resolve,reject)=>{
		connection.query(`delete from comments where id="${id}"`, function (error, results, fields) {
			if(!results) resolve(-1);
			if(results.affectedRows == 1){
				// 操作成功
				// 更新json
				upDateJSON('./dist/comments.json');
				resolve(1);
			}else{
				// 数据库错误
				resolve(-1);
			}
		});
	});
}
module.exports = {register, login, add, deleteComent};
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

module.exports = {register, login};
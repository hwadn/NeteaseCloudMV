const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}));

// Serve the files on port 3000.
app.listen(3000, function () {
  console.log('Example app listening on port 3000!\n');
});
/*******************************************************************************/
// 聊天室模块
/*******************************************************************************/
// websocket
var ws = require("nodejs-websocket");
var server = ws.createServer(function (conn) {
	// 接收消息事件
	conn.on("text", function (str) {
		let msg = JSON.parse(str);
		if(msg.type == 'msg'){
			broadcast(server, str);
		}else{
			console.log('格式错误');
		}
	});
	// 断开
	conn.on("close", function (code, reason) {
		// 广播连接数
		broadcastVisit(server);
	})
}).listen(8001);
// 新连接
server.on("connection", function(){
	broadcastVisit(server);
});
// 广播消息
function broadcast(server, msg) {
	server.connections.forEach(function (conn) {
		conn.sendText(msg)
	});
}
// 广播实时访问数
function broadcastVisit(server) {
	// 发送实时访问数
	let visitNumber = server.connections.length;
	let resText = {
		type: 'visit',
		number: visitNumber
	};
	let msg = JSON.stringify(resText);
	server.connections.forEach(function (conn) {
		conn.sendText(msg);
	});
}

/************************************************************************************/
// 登录模块
/************************************************************************************/
// post主体解析模块
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data
// 接口函数
const mysqlApi = require('./mysql.js');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// jwt的token
let jwt = require('jsonwebtoken');
// HMAC 256 对称加密
function createToken(username){
	let secret = 'adsq2er2ret41rt*w'; // 密钥
	return jwt.sign({username},secret);
}
// token解密验证。正确返回用户名
function verifyToken(token){
	let secret = 'adsq2er2ret41rt*w'; // 密钥
	try{
		return jwt.verify(token, secret);
	}catch(err){
		return false;
	}
}

// 解析cookie
var cookieParser = require('cookie-parser')
app.use(cookieParser())

// 注册
app.post('/myregister', upload.array(), function(req, res){
	let body = req.body;
	mysqlApi.register(req.body).then(value=>{
		let result = JSON.parse(value);
		// 注册成功，自动登录
		if(result.code == 1){
			// 设置令牌token。cookie一天.IE8以下不支持Max0Age。httpOnly
			let token = createToken(body.username);
			res.set('Set-Cookie', `token=${token};Max-Age=86400;HttpOnly`);
		}
		// 发送
		res.send(value);
	});
});
// 登录
app.post('/mylogin', upload.array(), function(req, res){
	let username = req.body.username;
	mysqlApi.login(req.body.username).then(value=>{
		// 用户不存在
		if(value == 'nothing'){
			// 用户不存在，拒绝登录，-1表示
			res.send('{"code":-1}');
		}else if(value == req.body.password){
			// 用户存在，密码正确。可以登录，1表示
			// 设置令牌token。cookie一天.IE8以下不支持Max0Age。httpOnly
			let token = createToken(username);
			res.set('Set-Cookie', `token=${token};Max-Age=86400;HttpOnly`);
			// 发送
			res.send('{"code":1}');
		}else{
			// 用户存在，密码不正确，0表示
			res.send('{"code":0}');
		}
	});
});
// 是否登录cookie
app.get('/isLogin', function(req, res){
	let token = req.cookies.token;
	// 校验token
	let result = verifyToken(token);
	if(result != false){
		// 发送
		res.send(result.username);
	}else{
		res.status(401).send('No Login');
	}
});
// 登出
app.post('/logout', function(req, res){
	let token = req.cookies.token;
	// 清除cookie
	res.set('Set-Cookie', `token=${token};Max-Age=-1;HttpOnly`);
	res.send('{"code":1}');
});

// 留言接口
// 读取静态资源
app.use(express.static('dist'));
// 发表评论
app.post('/record/add', upload.array(), function(req, res){
	// referer验证
	let username = req.body.username;
	let comment = req.body.comment;
	// 时间计算
	let now = new Date();
	let year = now.getFullYear();
	let month = now.getMonth()+1;
	let date = now.getDate();
	let hours = now.getHours();
	if(hours<10)hours = '0' + hours;
	let minutes = now.getMinutes();
	if(minutes<10)minutes = '0' + minutes;
	let sqlTime = `${year}/${month}/${date}/${hours}/${minutes}`;
	// id = 用户名+时间戳
	let id = username + Date.now();
	// 加入数据库
	mysqlApi.add(id, username, comment, sqlTime).then(value=>{
		// 发表成功
		if(value == 1){
			res.send('{"code":1}');
		}else{
			// 数据库错误
			res.send('{"code":-1}');
		}
	});
});
// 删除
app.post('/record/remove', upload.array(), function(req, res){
	let id = req.body.id;
	// 加入数据库
	mysqlApi.deleteComent(id).then(value=>{
		// 删除成功
		if(value == 1){
			res.send('{"code":1}');
		}else{
			// 数据库错误
			res.send('{"code":-1}');
		}
	});
});
// 请求拦截。防止csrf
app.all('/*', function(req, res, next){
	let reqUrl = req.get("Referer");
	let selfUrl = "http://localhost:3000";
	// 跨域请求不允许
	if(reqUrl==undefined || reqUrl.indexOf(selfUrl) != 0){
		res.status(403).send('Forbidden');
	}else{
		next();
	}
});
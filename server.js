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

/*****************************************************************************/
// post主体解析模块
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data
// 接口函数
const apiFn = require('./mysql.js');

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
	apiFn.register(req.body).then(value=>{
		let result = JSON.parse(value);
		// 注册成功，自动登录
		if(result.code == 1){
			// 设置令牌token。cookie一天.IE8以下不支持Max0Age。httpOnly
			let token = createToken(body.username);
			res.set('Set-Cookie', `token=${token};Max-Age=86400;HttpOnly`);
		}
		res.send(value);
	});
});
// 登录
app.post('/mylogin', upload.array(), function(req, res){
	let username = req.body.username;
	apiFn.login(req.body.username).then(value=>{
		// 用户不存在
		if(value == 'nothing'){
			// 用户不存在，拒绝登录，-1表示
			res.send('{"code":-1}');
		}else if(value == req.body.password){
			// 用户存在，密码正确。可以登录，1表示
			// 设置令牌token。cookie一天.IE8以下不支持Max0Age。httpOnly
			let token = createToken(username);
			res.set('Set-Cookie', `token=${token};Max-Age=86400;HttpOnly`);
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
		res.send(result.username);
	}else{
		res.status(401).send('No Login');
	}
});
// 登录
app.post('/logout', function(req, res){
	let token = req.cookies.token;
	// 清除cookie
	res.set('Set-Cookie', `token=${token};Max-Age=-1;HttpOnly`);
	res.send('{"code":1}');
});
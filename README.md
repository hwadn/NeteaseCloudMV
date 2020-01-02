# NeteaseCloudMV
## 网易云MV在线交流
项目起始时间：2019年12月14日  
## 一、技术栈
- webpack
- Vue
- Node.js
- mysql
## 二、运行
注意：

```
npm install
```
### 调试模式
```
npm run dev
```
### express后端模式
```
npm run server
```
### 打包
```
npm run build
```
## 三、实现功能
### 1 [天气组件](https://github.com/IamHuadong/NeteaseCloudMV/issues/1)  
### 2 [登录注册组件](https://github.com/IamHuadong/NeteaseCloudMV/issues/2) 
### 3 [轮播图组件](https://github.com/IamHuadong/NeteaseCloudMV/issues/3) 
### 4 [mv列表懒加载组件](https://github.com/IamHuadong/NeteaseCloudMV/issues/4) 
### 5 [视频播放组件组件](https://github.com/IamHuadong/NeteaseCloudMV/issues/5) 
### 6 聊天室组件——WebSocket
### 7 留言组件——node+mysql
## 四、后端接口
### 1、第三方开放接口——小白开放API
- IP城市接口
- 天气接口

注意：需要去小白网站注册会员才能使用，具体接口使用参考小白官网。
### 2、网易云音乐API——github白嫖
- mv接口等

注意：网易云MV接口需要下载后运行node server，具体参考 https://binaryify.github.io/NeteaseCloudMusicApi/
### 3、账户、留言接口——个人瞎写
#### (1)注册接口：/myregister
- post请求——body=username=xxx&password=xxxx
- 响应（json格式字符串：  
{"code":-1}——用户名已存在，
{"code":1}——注册成功

#### (2)登录接口：/mylogin
- post请求：body=username=xxx&password=xxxx
- 响应（json格式字符串）:  
{"code":-1}——用户名不存在
{"code":1}——登录成功。cookie设置为1天。HttpOnly。
{"code":1}——密码错误

#### (3)cookie登录接口：/isLogin
- post请求:自动携带cookie，无需携带任何内容。
- 响应：
成功：username——用户名
失败：401，No Login——未登录

#### (4)登出接口：/logout
- post请求:自动携带cookie，无需携带任何内容。
- 响应：{"code":1}cookie清除成功

#### (5)静态留言文件接口：/comments.json
- get请求

#### (6)发表留言接口：/record/add
- post请求：body="username=xxx&comment=xxx"
- 响应：  
{"code":1}——成功
{"code":-1}——失败、数据库错误

#### (7)删除评论接口：/record/remove
- post请求：body="id"
- 响应：  
{"code":1}——删除成功
{"code":-1}——失败、数据库错误
## 五、前端优化
### 1、响应式布局
- 全局宽度采用百分比
- media媒体查询调整字体、显示适应、高度适应
- 字体使用rem、em相对字体
### 2、性能优化
- 静态文件添加缓存头ETag——express自动添加
- DNS预解析——link标签中 rel="dns-prefetch"强制预解析
- webpack压缩,gzip
- mv封面图片懒加载：占位图避免回流、事件代理、滚动事件节流
- 按键防抖、拖动事件节流
### 3、安全
- 聊天室、留言板防御XSS——Vue自动转义、cookie设置HttpOnly
- 防御CSRF——cookie设置HttpOnly、后端校验Referer是否同源
### 4、SEO
- Vue-router用history模式
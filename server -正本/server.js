//借助第三方模块 express 搭建静态资源页面
//引入模块
const express = require('express');
const fs = require('fs');
const allrouter = require('./backend/router/index');//引入index

const app = express();

//借助中间件开启静态资源服务器

//以当前目录为站点目录
app.use(express.static('./'));
//使用allrouter中间件，实现路由效果
app.use(allrouter);
app.use((req,res)=>{
	let content = fs.readFileSync("./index.html");
	res.set("Content-Type","text/html; charset=utf-8");
	res.send(content)
})
app.listen(1022, () => {
    console.log('服务器开启成功，请访问1022端口');
});
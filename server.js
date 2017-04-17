'use strict';
const c = require('./common');
const colors = require('colors');
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const db = mongoose.connection;
db.on('error', (error)=> {c.logError(error);});
db.once('open', () => {c.logInfo("connected to MongoDB！");});

///!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
mongoose.connect('mongodb://localhost/express_mongo');///!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//初始化Express应用
const app = express();

app.set('port', (process.env.PORT || 3000));

http://enable-cors.org/server_expressjs.html
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", 
            "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");            
  next();
});

//引入Game的Router
const apiRouterGameV1 = require("./api/v1/game");

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

//使用body-parser包将HTTP请求Body里的参数解析到对象中
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'))
});

//使用用户管理的Router尝试匹配
app.use("/api/v1/game",apiRouterGameV1);

//应用退出时断开与MongoDB的连接
process.on('SIGINT',function(){
  db.close(function(){
    process.exit(0);
  });
});

//启动Express开始侦听到达端口3000的HTTP请求
app.listen(app.get('port'), function() {
  c.logInfo("Express应用已在端口3000开始侦听......");
});
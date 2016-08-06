
const path = require('path'); 
const express = require('express');
const app = express();

// 使用静态文件服务器中间件
app.use(express.static( path.join(__dirname, 'app', 'public') ));



app.listen(8088);


let express = require('express');
let path = require('path'); 
let app = express();

// 会话
let cookieParser = require('cookie-parser');
let session = require('express-session');
let MongoStore = require('connect-mongo')(session); // 会话导入到数据库中

// 连接数据库
let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/shop');

// post 请求
let bodyParser = require('body-parser');

let users = require('./routes/users.js');

// 使用静态文件服务器中间件
app.use(express.static( path.join(__dirname, 'app', 'public') ));

// 解析JSON数据  // conent-type application/json
app.use(bodyParser.json());

// application/x-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));


// 路由中间件
app.use('/users', users);

// 会话
app.use(session({
	secret: 'shop',
	resave: true,
	saveUninitialized: true,
	cookie: {
		maxAge: 60 * 60 * 100
	},
	stroe: new MongoStore({
		url: 'mongodb://127.0.0.1/shop'
	})
}));


app.listen(8088);

console.log('启动成功');

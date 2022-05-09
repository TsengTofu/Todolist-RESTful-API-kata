/**
 *  TODO
 * 第二週任務確認修正完畢後，先下版本號，project 資料夾要取代掉 main 分支
 */
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();
const dbUrl = process.env.DB_URL.replace(
	'<password>',
	process.env.USER_PASSWORD
).replace('<databasename>', process.env.DB_NAME);

// 連接資料庫
mongoose
	.connect(dbUrl)
	.then((response) => {
		console.log(response, '有連接到資料庫囉！');
	})
	.catch((error) => {
		console.log(error, 'error，看起來是資料庫的問題！');
	});

const indexRouter = require('./routes/index');
const postsRouter = require('./routes/posts');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * 處理 bodyParser 解析失敗的錯誤：
 * http://expressjs.com/en/resources/middleware/body-parser.html
 * 發生解析錯誤時，針對錯誤回傳對應的訊息
 */
app.use((err, req, res, callback) => {
	console.log('errorMessage:', err.message, ', error:', err.expose);
	console.log('statusCode:', err.statusCode, ', errorType:', err.type);
	res.send(err.type);
	res.sendStatus(400);
});

app.use('/', indexRouter);
app.use('/posts', postsRouter);

module.exports = app;

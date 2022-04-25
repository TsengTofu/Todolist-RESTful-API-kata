//  NOTE  這邊開始是新的
//  TODO  要記得寫 Repository 的 readme，補上每個版本號代表的作業週數
// 這邊可以捨棄 uuid
// 回來的時候，記得先把用端刪除，剛推的 commit 只是為了備份
const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const getAllPostAPI = require('./Routes/getAllPostAPI'); // GET
const createPostAPI = require('./Routes/createPostAPI'); // POST
const deletePostAPI = require('./Routes/deletePostAPI'); // DELETE
const updatePostAPI = require('./Routes/updatePostAPI'); // PATCH



dotenv.config();
// 資料庫位置
const dbUrl = process.env.DB_URL.replace('<password>', process.env.USER_PASSWORD).replace('<databasename>', process.env.DB_NAME);

// 連接資料庫
mongoose.connect(dbUrl).then((response) => {
  console.log('有連接到資料庫囉！');
}).catch((error) => {
  // console.log(error, 'error');
});

const headers = {
  'Access-Control-Allow-Headers':
  'Content-Type, Authorization, Content-Length, X-Requested-With',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
  'Content-Type': 'application/json',
};

const requestListener = async (req, res) => {
 
  // 判斷路由後，需要對 MongoDB 執行的操作
  if (req.url.startsWith('/posts') && req.method === 'GET') {
    // 取得全部貼文 API - GET
    //  ASK  這邊也需要 try catch？get 也有可能會出錯
    getAllPostAPI(req, res, headers);
  } else if (req.url === '/posts' && req.method === 'POST') {
    createPostAPI(req, res, headers);
  } else if (req.url === '/posts' && req.method === 'DELETE') {
    deletePostAPI(req, res, 'all');
  } else if (req.url.startsWith('/posts/') && req.method === 'DELETE') {
    deletePostAPI(req, res, 'single');
  } else if (req.url.startsWith('/posts/') && req.method === 'PATCH') {
    updatePostAPI(req, res);
  } else if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  } else {
    res.writeHead(404, headers);
    res.write(JSON.stringify({ status: 'fail', data: '無此網站路由' }));
    res.end();
  }
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3005);

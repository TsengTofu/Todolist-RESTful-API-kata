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
 
  if (req.url.startsWith('/posts') && req.method === 'GET') {
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

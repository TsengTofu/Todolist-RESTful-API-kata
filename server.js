//  NOTE  這邊開始是新的
//  TODO  要記得寫 Repository 的 readme，補上每個版本號代表的作業週數
const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const getAllPostAPI = require('./Routes/getAllPostAPI');
const createAPostAPI = require('./Routes/createAPostAPI');

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
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });
  // 判斷路由後，需要對 MongoDB 執行的操作
  if (req.url.startsWith('/posts') && req.method === 'GET') {
    // 取得全部貼文 API - GET
    //  ASK  這邊也需要 try catch？get 也有可能會出錯
    console.log('GET 取得全部貼文資料 API');
    getAllPostAPI(req, res, headers);
  } else if (req.url === '/posts' && req.method === 'POST') {
    // 新增貼文 API - POST
    console.log('POST 新增一筆貼文資料 API');
    createAPostAPI(req, res, headers);
  } else if (req.url === '/posts' && req.method === 'DELETE') {
    // DELETE ALL

  } else if (req.url.startsWith('/posts/') && req.method === 'DELETE') {
    // DELETE ONE
  } else if (req.url.startsWith('/posts/') && req.method === 'PATCH') {
    // PATCH ONE
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





//  TODO  這段是舊的，要先註解掉
// const requestListener = (req, res) => {
// 	let body = '';
// 	req.on('data', (chunk) => {
// 		body += chunk;
// 	});

// 	if (req.url === '/todos' && req.method === 'GET') {
//     successHandler(res, todos);
// 	} else if (req.url === '/todos' && req.method === 'POST') {
		// req.on('end', () => {
		// 	try {
		// 		const clientData = JSON.parse(body);
		// 		const { title } = clientData;
		// 		if (title !== undefined) {
		// 			const tempNewToDo = {
		// 				title: title,
		// 				id: uuidv4(),
		// 			};
		// 			todos.push(tempNewToDo);
    //       successHandler(res, todos);
		// 		} else {
		// 			errorHandler(res);
		// 		}
		// 	} catch (error) {
		// 		errorHandler(res);
		// 	}
		// });
// 	} else if (req.url === '/todos' && req.method === 'DELETE') {
// 		todos.length = 0;
//     successHandler(res, todos);
// 	} else if (req.url.startsWith('/todos/') && req.method === 'DELETE') {
// 		const targetId = req.url.split('/').pop();
// 		const targetIndex = todos.findIndex(
// 			(element) => element.id === targetId
// 		);
// 		if (targetIndex !== -1) {
// 			todos.splice(targetIndex, 1);
// 			successHandler(res, todos);
// 		} else {
// 			errorHandler(res);
// 		}
// 	} else if (req.url.startsWith('/todos/') && req.method === 'PATCH') {
// 		req.on('end', () => {
// 			try {
// 				const targetId = req.url.split('/').pop();
// 				const targetIndex = todos.findIndex(
// 					(element) => element.id === targetId
// 				);

// 				const clientData = JSON.parse(body);
// 				const { title } = clientData;

// 				if (targetIndex !== -1 && title !== undefined) {
// 					todos[targetIndex].title = title;
// 					successHandler(res, todos);
// 				} else {
// 					errorHandler(res);
// 				}
// 			} catch (error) {
// 				errorHandler(res);
// 			}
// 		});
// 	} else if (req.method === 'OPTIONS') {
// 		res.writeHead(200, headers);
// 		res.end();
// 	} else {
// 		res.writeHead(404, headers);
// 		res.write(JSON.stringify({ status: 'fail', data: '無此網站路由' }));
// 		res.end();
// 	}
// };

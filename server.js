//  TODO  感覺目前少了一些東西，TODO LIST 應該不會只有一個 title
const http = require('http');
const { v4: uuidv4 } = require('uuid'); // 產隨機 id 的套件
const errorHandler = require('./errorHandler');

//  NOTE  這個必須寫在外面，不能寫在裡面
const todos = [];
const headers = {
	'Access-Control-Allow-Headers':
		'Content-Type, Authorization, Content-Length, X-Requested-With',
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
	'Content-Type': 'application/json',
};

const requestListener = (req, res) => {
	// req -> 請求者資料
	// 在瀏覽器輸入網址，也是一種 request
	// console.log(req, ':req'); // 是一個有很多資訊的物件
	// console.log(req.url, '請求的資料路徑');
	// console.log(req.methods, '請求資料的方式'); // OPTIONS 可以是一種 Methods

	// 筆記：網路請求只看得懂字串，會用到 JSON.stringify
	// Restful API preflight 機制，事先確認一次（keyword -> 預先檢測），才再次發出請求
	// 下次檢查 Network 可以嘗試看看有沒有出現 preflight

	/**
	 * TO-DO-LIST 練習
	 * GET    取得所有待辦事項
	 * POST   新增待辦事項
	 * OPTIONS
	 * PATCH  編輯指定待辦事項
	 * DELETE 刪除所有待辦事項
	 * DELETE 刪除指定待辦事項
	 * NOT FOUND 404 路由顯示
	 *
	 * 嘗試一下 POSTMAN 會出現的結果
	 * req.url && req.method
	 * 可以用 POSTMAN 的 Collection 功能去管理 API
	 *
	 * 章節：如何接收 POST API 的 body 資料？
	 * TCP 封包 -> 檔案傳輸，一次傳一部分，不會是整張圖一次一起上傳
	 * 可能會切成好幾塊，批次上傳
	 *  NOTE  教學影片寫在最前面
	 * let body = '';
	 * req.on('data', (chunk) => {
	 *   console.log(chunk); // 傳輸的過程
	 *   body += chunk;
	 * }) // 設定傳輸檔案
	 * req.on('end', () => { console.log(body); })  // 印出 body
	 * 要取得 body 傳送過來的值，必須要先將 body 從字串轉成物件 JSON.parse(body);
	 * 接著要做 Client 端傳過來的資料驗證，有點類似 Jokie 之前提到的「檢查」
	 * 避免傳過來的資料造成整個 API Crush，所以會使用 try...catch，並且針對 error 做特定的處理
	 * 章節關鍵字：重構 POST API 異常行為
	 *  NOTE  刪除全部待辦事項 API -> array.length = 0; 可以直接清空陣列
	 * DELETE 跟 POST 不一樣的地方在於，POST 需要傳 BODY 但是 DELETE 可以透過網址
	 *  NOTE  刪除單筆：string.startsWith('testString')，驗證網址是否包含自定義的路由
	 * split('/').pop()，這可以取得最右邊的 uuid 的值 -> 這個蠻酷的
	 * array.findIndex 找出要刪除的 uuid，是我的話會用 indexOf
	 * 找到 uuid 的 index 之後再從預設的 todos 陣列刪除
	 * 也要處理如果該傳入的 uuid 不存在，要做對應的處理，以及錯誤處理
	 *  NOTE  PATCH 也跟 POST 一樣要接收 request body，編輯的部分
	 *  ASK  為什麼不能用 switch？為何傳送的資料必須寫成：{ "title": "testTitle" } 都必須要用字串的形式？
	 * 接收到編輯後的資料 req.on('end', () => { console.log(body); })
	 * 接著判斷 title 是否存在 && 該筆待辦 todo 存在
	 *  NOTE  可以用 POSTMAN 測試開發好的 API 部署到 HEROKU 的結果
	 */

	let body = ''; // 接收到的資料
	req.on('data', (chunk) => {
		body += chunk;
	}); // 設定傳輸檔案

	// 取得全部的待辦事項
	if (req.url === '/todos' && req.method === 'GET') {
		res.writeHead(200, headers);
		res.write(JSON.stringify({ status: 'success', data: todos }));
		res.end();
		// 新增單筆待辦事項
	} else if (req.url === '/todos' && req.method === 'POST') {
		req.on('end', () => {
			try {
				res.writeHead(200, headers);
				const clientData = JSON.parse(body);
				const { title } = clientData;
				if (title !== undefined) {
					const tempNewToDo = {
						title: title,
						id: uuidv4(),
					};
					todos.push(tempNewToDo);
					res.write(
						JSON.stringify({ status: 'success', data: todos })
					);
					res.end();
				} else {
					errorHandler(res);
				}
			} catch (error) {
				errorHandler(res);
			}
		});
	} else if (req.url === '/todos' && req.method === 'DELETE') {
		todos.length = 0;
		res.writeHead(200, headers);
		res.write(
			JSON.stringify({
				status: 'success',
				data: [],
				delete: 'yes',
			})
		);
		res.end();
	} else if (req.url.startsWith('/todos/') && req.method === 'DELETE') {
		const targetId = req.url.split('/').pop();
		const targetIndex = todos.findIndex(
			(element) => element.id === targetId
		);
		if (targetIndex !== -1) {
			todos.splice(targetIndex, 1);
			res.writeHead(200, headers);
			res.write(
				JSON.stringify({
					status: 'success',
					data: todos,
					delete: 'yes',
				})
			);
			res.end();
		} else {
			errorHandler(res);
		}
	} else if (req.url.startsWith('/todos/') && req.method === 'PATCH') {
		req.on('end', () => {
			try {
				// 因為有可能在某一行失敗，所以要用 try...catch
				const targetId = req.url.split('/').pop();
				const targetIndex = todos.findIndex(
					(element) => element.id === targetId
				);

				const clientData = JSON.parse(body);
				const { title } = clientData;

				if (targetIndex !== -1 && title !== undefined) {
					todos[targetIndex].title = title;
					res.writeHead(200, headers);
					res.write(
						JSON.stringify({
							status: 'success',
							data: todos,
							delete: 'yes',
						})
					);

					res.end();
				} else {
					errorHandler(res);
				}
			} catch (error) {
				errorHandler(res);
			}
		});
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
// port -> 設定路由位置，localhost:3005 即可看到顯示結果
server.listen(3005); // localhost 測試的寫法

// server.listen(process.env.PORT || 3005); // HEROKU 設定
// 推到 HEROKU 指令：git push heroku main
// heroku open 可以打開特定專案，也可以透過 GUI 打開

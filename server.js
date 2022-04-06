const http = require('http');
const { v4: uuidv4 } = require('uuid');
const errorHandler = require('./errorHandler');
const successHandler = require('./successHandler');
const headers = require('./corsHeader');
const todos = [];
const requestListener = (req, res) => {
	let body = '';
	req.on('data', (chunk) => {
		body += chunk;
	});

	if (req.url === '/todos' && req.method === 'GET') {
    successHandler(res, todos);
	} else if (req.url === '/todos' && req.method === 'POST') {
		req.on('end', () => {
			try {
				const clientData = JSON.parse(body);
				const { title } = clientData;
				if (title !== undefined) {
					const tempNewToDo = {
						title: title,
						id: uuidv4(),
					};
					todos.push(tempNewToDo);
          successHandler(res, todos);
				} else {
					errorHandler(res);
				}
			} catch (error) {
				errorHandler(res);
			}
		});
	} else if (req.url === '/todos' && req.method === 'DELETE') {
		todos.length = 0;
    successHandler(res, todos);
	} else if (req.url.startsWith('/todos/') && req.method === 'DELETE') {
		const targetId = req.url.split('/').pop();
		const targetIndex = todos.findIndex(
			(element) => element.id === targetId
		);
		if (targetIndex !== -1) {
			todos.splice(targetIndex, 1);
			successHandler(res, todos);
		} else {
			errorHandler(res);
		}
	} else if (req.url.startsWith('/todos/') && req.method === 'PATCH') {
		req.on('end', () => {
			try {
				const targetId = req.url.split('/').pop();
				const targetIndex = todos.findIndex(
					(element) => element.id === targetId
				);

				const clientData = JSON.parse(body);
				const { title } = clientData;

				if (targetIndex !== -1 && title !== undefined) {
					todos[targetIndex].title = title;
					successHandler(res, todos);
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
server.listen(process.env.PORT || 3005);

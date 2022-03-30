const http = require('http');
const { v4: uuidv4 } = require('uuid');
const errorHandler = require('./errorHandler');

const todos = [];
const headers = {
	'Access-Control-Allow-Headers':
		'Content-Type, Authorization, Content-Length, X-Requested-With',
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
	'Content-Type': 'application/json',
};

const requestListener = (req, res) => {
	let body = '';
	req.on('data', (chunk) => {
		body += chunk;
	});

	if (req.url === '/todos' && req.method === 'GET') {
		res.writeHead(200, headers);
		res.write(JSON.stringify({ status: 'success', data: todos }));
		res.end();
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
server.listen(process.env.PORT || 3005);

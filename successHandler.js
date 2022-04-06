const headers = require('./corsHeader');
function successHandler(res, todoData) {
  res.writeHead(200, headers);
  res.write(JSON.stringify({ status: 'success', data: todoData }));
  res.end();
}

module.exports = successHandler;
const headers = require('./corsHeader');

function errorHandler(res, message) {  
  res.writeHead(400, headers);
  res.write(JSON.stringify({
    "status": "fail",
    "message": message,
  }));
  res.end();
};

module.exports = errorHandler;
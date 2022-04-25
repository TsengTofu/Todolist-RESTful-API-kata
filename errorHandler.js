const headers = require('./corsHeader');
function errorHandler(res) {  
  res.writeHead(400, headers);
  res.write(JSON.stringify({
    "status": "fail",
    "message": "欄位未填寫正確，或無此待辦事項" 
  }));
  res.end();
};

module.exports = errorHandler;
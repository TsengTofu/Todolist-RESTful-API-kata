const headers = require('./corsHeader');
const successResponse = (res, data) => {
  //  TODO  這邊可以客製化要傳遞的訊息
  res.writeHead(200, headers);
  res.write(JSON.stringify(
    {
      status: 'success',
      message: '已成功取得全部貼文資料',
      data,
    },
  ));
  res.end();
};

module.exports = successResponse;

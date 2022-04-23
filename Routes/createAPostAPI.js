// 撰寫一篇貼文
const url = require('url');
const PostModel = require('../Models/post');
const successResponse = require('../APIResponesModule/successResponse');


const createAPostAPI = async (req, res, headers, body) => {
  console.log('createAPostAPI');
  // 接收資料
  //  TODO  這邊還沒改完
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
  res.writeHead(200, headers);
  res.write(JSON.stringify(
    {
      status: 'success',
      data: '已成功 Call POST 新增一筆貼文資料 API',
    },
  ));
  res.end();

};
module.exports = getAllPostAPI;
const PostModel = require('../Models/post');
const successResponse = require('../APIResponesModule/successResponse');
const errorHandler = require('../APIResponesModule/errorHandler');

const createPostAPI = async (req, res, headers) => {
  //  ASK  這個一定要放裡面嗎？ 
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });
  req.on('end', async() => {
    try {
      const postContentData = JSON.parse(body);
      const { userName, userImage, contentMessage, contentImage } = postContentData;
      if(userName && userImage && contentMessage && contentImage) {
        const createResult = await PostModel.create({
          user_name: userName,
          user_image: userImage,
          content_message: contentMessage,
          content_image: contentImage,
        });
        successResponse(res, createResult);
      } else {
        errorHandler(res, '新增貼文失敗，請稍候重試');
      }
    } catch(error) {
      errorHandler(res, '新增貼文失敗，請稍候重試');
    }
  });
};
module.exports = createPostAPI;

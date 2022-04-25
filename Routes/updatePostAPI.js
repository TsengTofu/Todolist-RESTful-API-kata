const PostModel = require("../Models/post");
const successResponse = require('../APIResponesModule/successResponse');
const errorHandler = require('../APIResponesModule/errorHandler');

const updatePostAPI = async (req, res) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', async() => {
    try {
      const postContentData = JSON.parse(body);
      const targetId = req.url.split('/').pop();
      const { contentMessage, contentImage } = postContentData;

      if(targetId && contentMessage && contentImage) {
        const updateResult = await PostModel.findByIdAndUpdate(targetId, {
          content_message: contentMessage,
          content_image: contentImage
        });
        const targetData = await PostModel.findById(targetId);
        successResponse(res, targetData);
      } else {
        errorHandler(res, '編輯失敗，updatePostAPI 有錯誤！');
      }
    } catch(error) {
      errorHandler(res, '編輯失敗，updatePostAPI 有錯誤！');
    }
  });
};

module.exports = updatePostAPI;


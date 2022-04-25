const PostModel = require("../Models/post");
const successResponse = require('../APIResponesModule/successResponse');
const errorHandler = require('../APIResponesModule/errorHandler');

const deletePostAPI = async (req, res, type) => {
  switch (type) {
    case 'all':
      try {
        const deleteReult = await PostModel.deleteMany({});
        successResponse(res, deleteReult);
      } catch (error) {
        errorHandler(res, '刪除全部貼文失敗！');
      }
      break;
    case 'single':
      try {
        const targetId = req.url.split('/').pop();
        if (targetId === '')  errorHandler(res);
        const deleteSingleResult = await PostModel.findByIdAndDelete({"_id": targetId});
        successResponse(res, deleteSingleResult);
      } catch (error) {
        errorHandler(res, '刪除單篇貼文失敗！');
      };
      break;
  }


};
module.exports = deletePostAPI;

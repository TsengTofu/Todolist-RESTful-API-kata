const getAllPostAPI = require('./getAllPostAPI');
const createPostAPI = require('./createPostAPI');
const deletePostAPI = require('./deletePostAPI');
const updatePostAPI = require('./updatePostAPI');

//  ASK  錯誤的話是要順傳，或是建議在哪一段先做判斷呢？
//  ASK  corsHeader 不用再次撰寫，是因為 express 已經封裝了嗎？
// 錯誤處理與成功訊息的狀態整理
const PostController = {
	get: async (req, res) => {
		await getAllPostAPI(req, res);
	},
	create: async (req, res) => {
		await createPostAPI(req, res);
	},
	update: async (req, res) => {
		await updatePostAPI(req, res);
	},
	delete: async (req, res) => {
		await deletePostAPI(req, res);
	},
};

module.exports = PostController;

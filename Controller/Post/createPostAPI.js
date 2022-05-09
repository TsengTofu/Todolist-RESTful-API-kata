const PostModel = require('../../Models/post');

const createPostAPI = async (req, res) => {
	//  ASK  express 的 req.body 處理了什麼？
	// let body = '';
	// req.on('data', (chunk) => {
	//   body += chunk;
	// });
	// req.on('end', async() => {})

	try {
		const postContentData = req.body;
		if (postContentData) {
			const { userName, userImage, contentMessage, contentImage } =
				postContentData;
			if (userName && userImage && contentMessage && contentImage) {
				const createResult = await PostModel.create({
					user_name: userName,
					user_image: userImage,
					content_message: contentMessage,
					content_image: contentImage,
				});
				const finalData = {
					message: '成功新增一則貼文！',
					data: createResult,
				};
				res.status(200).send(finalData);
			} else {
				const finalData = {
					message: '新增貼文失敗，請稍候重試！',
					data: null,
				};
				res.status(400).send(finalData);
			}
		}
	} catch (error) {
		const finalData = {
			message: error.message,
			data: null,
		};
		res.status(400).send(finalData);
	}
};
module.exports = createPostAPI;

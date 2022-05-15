const PostModel = require('../../models/post');

const createPostAPI = async (req, res) => {
	try {
		const postContentData = req.body;
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
			return;
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

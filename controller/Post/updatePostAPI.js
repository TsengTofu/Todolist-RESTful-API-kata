const PostModel = require('../../models/post');

const updatePostAPI = async (req, res) => {
	console.log('updatePostAPI');
	try {
		const postContentData = req.body;
		const targetId = req.params.id;
		const { contentMessage, contentImage } = postContentData;

		if (targetId && contentMessage && contentImage) {
			const updateResult = await PostModel.findByIdAndUpdate(targetId, {
				content_message: contentMessage,
				content_image: contentImage,
			});
			if (updateResult === null) {
				const finalData = {
					message: '找不到此貼文！',
					data: updateResult,
				};
				res.status(400).send(finalData);
				return;
			}
			// 更新結果
			const targetData = await PostModel.findById(targetId);
			const finalData = {
				message: '更新貼文成功！',
				originData: updateResult,
				updateData: targetData,
			};
			res.status(200).send(finalData);
		} else {
			const finalData = {
				message: '更新貼文失敗！',
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

module.exports = updatePostAPI;

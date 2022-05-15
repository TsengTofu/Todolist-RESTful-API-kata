const PostModel = require('../../models/post');

const deletePostAPI = async (req, res) => {
	try {
		const targetId = req.params.id;
		if (targetId) {
			const deleteSingleResult = await PostModel.findByIdAndDelete({
				_id: targetId,
			});
			if (deleteSingleResult === null) {
				const finalData = {
					message: '刪除失敗，此篇貼文不存在！',
					data: null,
				};
				res.status(400).send(finalData);
			} else {
				const finalData = {
					message: '刪除成功！',
					data: deleteSingleResult,
				};
				res.status(200).send(finalData);
			}
		} else {
			const deleteResult = await PostModel.deleteMany({});
			const finalData = {
				message: '成功刪除全部的貼文！',
				data: deleteResult,
			};
			res.status(200).send(finalData);
		}
	} catch (error) {
		const finalData = {
			message: error.message,
			data: null,
		};
		res.status(400).send(finalData);
	}
};
module.exports = deletePostAPI;

const PostModel = require('../../Models/post');

const sortConstantConfig = ['asc', 'desc'];
const getAllPostAPI = async (req, res) => {
	const queryObject = req.query;

	const { sort, nameKeyword, contentKeyword } = queryObject;
	const isQueryEmpty = queryObject && Object.keys(queryObject).length === 0;
	if (!isQueryEmpty) {
		// 有 sort 的情境
		if (sortConstantConfig.includes(sort)) {
			if (contentKeyword || nameKeyword) {
				const sortData = await PostModel.find({
					$or: [
						{ content_message: { $regex: `${contentKeyword}` } },
						{ user_name: { $regex: `${nameKeyword}` } },
					],
				}).sort({ created_at: sort });
				const finalData = {
					message: '成功取得有排序的資料！',
					data: sortData,
				};
				res.status(200).send(finalData);
			} else {
				const sortData = await PostModel.find({}).sort({
					created_at: sort,
				});
				const finalData = {
					message: '成功取得有排序的資料！',
					data: sortData,
				};
				res.status(200).send(finalData);
			}
		} else {
			// 沒有 sort 的情境
			const pureData = await PostModel.find({
				$or: [
					{ content_message: { $regex: `${contentKeyword}` } },
					{ user_name: { $regex: `${nameKeyword}` } },
				],
			});
			const finalData = {
				message: '成功取得沒有排序的資料！',
				data: pureData,
			};
			res.status(200).send(finalData);
			// return pureData;
		}
	} else {
		// 單純撈資料
		const allData = await PostModel.find();
		const finalData = {
			message: '成功取得單純撈資料！',
			data: allData,
		};
		res.status(200).send(finalData);
	}
};
module.exports = getAllPostAPI;

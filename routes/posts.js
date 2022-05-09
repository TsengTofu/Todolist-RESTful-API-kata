/**
 * 貼文相關路由
 */
//  ASK  bin 資料夾裡程式碼的用途
const express = require('express');
const router = express.Router();
const PostController = require('../Controller/Post/index');

router.get('/', async function (req, res, next) {
	await PostController.get(req, res);
	next();
});

router.post('/', async function (req, res, next) {
	await PostController.create(req, res);
	next();
});

router.delete('/:id', async function (req, res, next) {
	await PostController.delete(req, res, 'single');
	next();
});

router.delete('/', async function (req, res, next) {
	await PostController.delete(req, res, 'all');
	next();
});

router.patch('/:id', async function (req, res, next) {
	await PostController.update(req, res);
});

module.exports = router;

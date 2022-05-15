/**
 * 貼文相關路由
 */
//  ASK  bin 資料夾裡程式碼的用途
const express = require('express');
const router = express.Router();
const PostController = require('../controller/post/index');

router.get('/', PostController.get);
router.post('/', PostController.create);
router.patch('/:id', PostController.update);
router.delete('/', PostController.delete);
router.delete('/:id', PostController.delete);

module.exports = router;

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    user_name: String,
    user_image: String,
    content_message: {
      type: String,
      required: [true, '貼文內容為必填'],
    },
    content_image: {
      type: String,
      required: [true, '貼文的圖片網址為必填'],
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

const Post = mongoose.model('Post', postSchema);
module.exports = Post;

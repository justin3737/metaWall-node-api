const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "請填寫創作者 ID"]
    },
    comment: {
      type: String,
      required: [true, "請填寫留言內容"]
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: "Post",
      required: [true, "請填寫貼文 ID"]
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false
  }
);

// 前置器：使用find 尋找 collections 裡面的資料
commentsSchema.pre(/^find/, function(next){
  this.populate({
    path: "user",
    select: "id nickName createdAt"
  });
  next();
});

// 建立 Model
const Comment = mongoose.model("Comment", commentsSchema);

module.exports = Comment;
const mongoose = require("mongoose");
const postsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "貼文 ID 未填寫"]
    },
    content: {
      type: String,
      required: [true, "內容未填寫"],
    },
    image: {
      type: [String]
    },
    createAt: {
      type: Date,
      default: Date.now
    },
    likes: [{
      type: mongoose.Schema.ObjectId,
      ref: "User"
    }],
    createAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
  }
);

postsSchema.virtual("comments", { // virtual(虛擬)：掛上 comments
  ref: "Comment",
  foreignField: "post",
  localField: "_id" // 引用：類似 join
});

const posts = mongoose.model(
  "posts",
  postsSchema
);

module.exports = posts;

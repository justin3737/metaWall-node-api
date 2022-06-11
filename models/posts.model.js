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

const posts = mongoose.model(
  "posts",
  postsSchema
);

module.exports = posts;

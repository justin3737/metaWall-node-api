const mongoose = require("mongoose");
const usersSchema = new mongoose.Schema(
  {
    nickName: {
      type: String,
      required: [true, "請填寫暱稱"]
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email 未填寫"]
    },
    password: {
      type: String,
      required: [true, "請填寫密碼"],
      minlength: 8,
      select: false
    },
    avator: {
      type: String
    },
    //男性:0 女性:1 跨性別:2
    gender: {
      type: Number,
      default: 0,
      enum: [0, 1, 2]
    },
    //我追蹤誰
    fallowing: [
      {
        user: { type: mongoose.Schema.ObjectId, ref: "User"},
        createdAt: {
          type: Date,
          default: Date.now
        },
        updatedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    //我的追蹤者
    followers: [
      {
        user: { type: mongoose.Schema.ObjectId, ref: "User"},
        createdAt: {
          type: Date,
          default: Date.now
        },
        updatedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    //建立時間
    createdAt: {
      type: Date,
      default: Date.now,
      select: false
    },
    //更新時間
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false
  }
);

const User = mongoose.model("User", usersSchema);

module.exports = User;
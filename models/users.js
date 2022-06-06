const mongoose = require("mongoose");
const usersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "貼文姓名未填寫"]
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
    photo: {
      type: String
    },
    gender: {
      type: String,
      default: "male",
      enum: ["male", "female"]
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false
    }
  },
  {
    versionKey: false
  }
);

const users = mongoose.model("user", usersSchema);

module.exports = users;
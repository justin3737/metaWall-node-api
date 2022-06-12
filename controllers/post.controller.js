const getHttpResponse = require("../service/successHandler");
const { handleErrorAsync, appError } = require("../service/handleError");

const mongoose = require("mongoose");
const User = require("../models/users.model");
const Post = require("../models/posts.model");
const Comment = require("../models/comments.model");

const post = {
  //取得全部貼文
  getPosts: handleErrorAsync(async (req, res) => {
    const {
      query: {
        q,
        sort = "desc"
      }
    } = req;
    const filter = q ? { content: new RegExp(q) } : {};
    const posts = await Post.find(filter)
      .populate({ path: "user", select: "nickName avatar" })
      .populate({
        path: "comments",
        select: "comment user"
      }).sort({ createdAt: sort === "desc" ? -1 : 1 });
    res.status(200).json(getHttpResponse({ data: posts }));
  }),
  //取得單一貼文
  getPost: handleErrorAsync(async (req, res, next) => {

  }),
  createdPosts: handleErrorAsync(async (req, res, next) => {
    const {
      user,
      body: {
        content,
        image
      }
    } = req;
    if (content === undefined || content === "" || user === undefined) {
      return next(appError(400, "你沒有填寫user或是content"));
    }
    // 判斷圖片開頭是否為 http
    if (image && image.length > 0) {
      image.forEach(function (item) {
        let result = item.split(":");
        if (!validator.equals(result[0], "https")) {
          return next(appError(400, "新增失敗，圖片格式不正確"));
        }
      });
    }
    const newPost = await Post.create({
      user,
      content,
      image
    });
    res.status(200).json(getHttpResponse({
      data: newPost
    }));
  })
};

module.exports = post;
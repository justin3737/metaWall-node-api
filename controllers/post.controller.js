const getHttpResponse = require("../service/successHandler");
const { handleErrorAsync, appError } = require("../service/handleError");

const User = require("../models/users.model");
const Post = require("../models/posts.model");

const post = {
  //取得全部貼文
  getPosts: handleErrorAsync(async (req, res, next) => {
    const timeSort = req.query.timeSort === "asc" ? "createAt" :  "-createAt";
    const q = req.query.q !== undefined ? { "content": new RegExp(req.query.q) } : {};
    const allPosts = await Post.find(q).populate({
      path: "user",
      select: "nickName avatar"
    }).sort(timeSort);
    res.status(200).json(getHttpResponse({
      data: allPosts
    }));
  }),
  //取得單一貼文
  getPost: handleErrorAsync(async (req, res, next) => {

  }),
  createdPosts: handleErrorAsync(async (req, res, next) => {
    const { body } = req;
    if (body.content === undefined || body.content === "" || body.user === undefined) {
      return next(appError(400, "你沒有填寫user或是content"));
    }
    if (body.image && !body.image.startsWith("https")) {
      return next(appError(400, "貼文圖片網址錯誤"));
    }
    const newPost = await Post.create({
      user: body.user,
      content: body.content,
      image: body.image
    });
    res.status(200).json(getHttpResponse({
      data: newPost
    }));
  })
};

module.exports = post;
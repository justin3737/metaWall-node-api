const express = require("express");
const router = express.Router();
const PostsControllers = require("../controllers/post.controller");
const FileControllers = require("../controllers/file.controller");
const { isAuth } = require("../middleware/auth");

//取得所有貼文
router.get("/", isAuth, (req, res, next) =>
  PostsControllers.getPosts(req, res, next)
);

//取得單一貼文
router.get("/:postID", isAuth, (req, res, next) =>
  PostsControllers.getPost(req, res, next)
);

//新增貼文
router.post("/", isAuth, (req, res, next) =>
  PostsControllers.createdPosts(req, res, next)
);

//新增貼文
router.post("/:postID/comment", isAuth, (req, res, next) =>
  PostsControllers.createdComments(req, res, next)
);

//上傳圖片
router.post("/image", isAuth, (req, res, next) =>
  FileControllers.upload(req, res, next)
);



/*
[GET]取得所有貼文：{url}/posts
[GET]取得單一貼文：{url}/posts/{postID}
[POST]新增貼文：{url}/posts
[POST]新增一則貼文的讚：{url}/posts/{postID}/like
[DELETE]取消一則貼文的讚：{url}/posts/{postID}/unlike
[POST]新增一則貼文的留言：{url}/posts/{postID}/comment
[GET]取得個人所有貼文列表：{url}/post/user/{userID}
*/


module.exports = router;

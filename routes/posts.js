const express = require("express");
const router = express.Router();
const PostsControllers = require("../controllers/post.controller");
const FileControllers = require("../controllers/file.controller");
const { isAuth } = require("../middleware/auth");

//取得所有貼文
router.get("/", isAuth, PostsControllers.getPosts);

//取得單一貼文
router.get("/:postID", isAuth, PostsControllers.getPost);

//取得個人所有貼文列表
router.get("/user/:userID", isAuth, PostsControllers.getUserPosts);

//新增貼文
router.post("/", isAuth, PostsControllers.createdPosts);

//新增一則貼文的留言：
router.post("/:postID/comment", isAuth, PostsControllers.createdComments);

// 新增一則貼文的讚
router.post("/:postID/like", isAuth, PostsControllers.insertLike);

// 取消一則貼文的讚
router.delete("/:postID/unlike", isAuth, PostsControllers.delLike);

//上傳圖片
router.post("/image", isAuth, FileControllers.upload);


module.exports = router;

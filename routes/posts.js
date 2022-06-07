var express = require("express");
var router = express.Router();
const PostsControllers = require("../controllers/post.controller");
const isAuth = require("../middleware/auth");

router.get("/", isAuth, (req, res, next) =>
  PostsControllers.getPosts(req, res, next)
);

router.post("/", isAuth, (req, res, next) =>
  PostsControllers.createdPosts(req, res, next)
);

module.exports = router;

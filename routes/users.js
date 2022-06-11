var express = require("express");
var router = express.Router();
const { isAuth } = require("../middleware/auth");
const UserController = require("../controllers/user.controller");

//註冊
router.post("/sign_up", (req, res, next) =>
  UserController.signUp(req, res, next)
);

//登入
router.post("/sign_in", (req, res, next) =>
  UserController.signIn(req, res, next)
);

//重設密碼
router.patch("/updatePassword", isAuth, (req, res, next) =>
  UserController.updatePassword(req, res, next)
);

//取得個人資料
router.get("/profile", isAuth, (req, res, next) =>
  UserController.getProfile(req, res, next)
);

//更新個人資料
router.patch("/profile", isAuth, (req, res, next) =>
  UserController.updateProfile(req, res, next)
);


/*
[POST]追蹤朋友：{url}/users/{userID}/follow
[DELETE]取消追蹤朋友：{url}/users/{userID}/unfollow
[GET]取得個人按讚列表：{url}/users/getLikeList
[GET]取得個人追蹤名單：{url}/users/following
*/

module.exports = router;
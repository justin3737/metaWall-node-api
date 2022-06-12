var express = require("express");
var router = express.Router();
const { isAuth } = require("../middleware/auth");
const UserController = require("../controllers/user.controller");

//註冊
router.post("/sign_up", UserController.signUp);

//登入
router.post("/sign_in", UserController.signIn);

//重設密碼
router.patch("/updatePassword", isAuth, UserController.updatePassword);

//取得個人資料
router.get("/profile", isAuth, UserController.getProfile);

//更新個人資料
router.patch("/profile", isAuth, UserController.updateProfile);

//追蹤朋友
router.post("/:userID/follow", isAuth, UserController.follow);

//取消追蹤朋友
router.delete("/:userID/unfollow", isAuth, UserController.unfollow);

/*
[POST]追蹤朋友：{url}/users/{userID}/follow
[DELETE]取消追蹤朋友：{url}/users/{userID}/unfollow
[GET]取得個人按讚列表：{url}/users/getLikeList
[GET]取得個人追蹤名單：{url}/users/following
*/

module.exports = router;
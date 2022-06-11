const validator = require("validator");
const bcrypt = require("bcryptjs/dist/bcrypt");
const getHttpResponse = require("../service/successHandler");
const { handleErrorAsync, appError } = require("../service/handleError");
const { generateJwtToken } = require("../middleware/auth");
const User = require("../models/users.model");

const user = {
  // 註冊會員
  signUp: handleErrorAsync(async (req, res, next) => {
    let {
      body: { nickName, email, password, confirmPassword },
    } = req;
    //內容不可為空
    if (!nickName || !email || !password || !confirmPassword)
      return next(appError(400, "欄位未正確填寫"));

    //密碼正確
    if (password!==confirmPassword)
      return next(appError(400, "密碼不一致"));

    //密碼 8 碼以上
    if (!validator.isLength(password, {min: 8}))
      return next(appError(400, "密碼數字低於 8 碼"));

    //是否為 Email
    if (!validator.isEmail(email))
      return next(appError(400, "Email 格式不正確"));

    //已被註冊
    const exist = await User.findOne({ email });
    if (exist)
      return next(appError("201", "帳號已被註冊，請替換新的 Email"));

    //加密密碼
    password = await bcrypt.hash(req.body.password, 12);
    const newUser = await User.create({
      email,
      password,
      nickName
    });
    const token = await generateJwtToken(newUser._id);
    if (token.length === 0) {
      return next(appError(400, "token 建立失敗"));
    }
    const data = {
      token,
      "id": newUser._id
    };
    res.status(200).json(getHttpResponse({
      data
    }));
  }),
  signIn: handleErrorAsync(async (req, res, next) => {
    const {
      body: { email, password }
    } = req;
    //確認帳號密碼不為空
    if (!email || !password)
      return next(appError(400, "欄位未正確填寫"));

    //確認有這位使用者
    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return next(appError(400, "您尚未註冊會員"));
    //帳號或密碼錯誤
    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth)
      return next(appError(400, "您的密碼不正確"));

    const token = await generateJwtToken(user._id);
    if (token.length === 0) {
      return next(appError(400, "token 建立失敗"));
    }
    const data = {
      token,
      "id": user._id
    };
    res.status(200).json(getHttpResponse({
      data
    }));
  }),
  updatePassword: handleErrorAsync(async (req, res, next) => {
    const {
      user,
      body: {
        oldPassword, password, confirmPassword
      }
    } = req;

    //內容不可為空
    if (!oldPassword || !password || !confirmPassword)
      return next(appError(400, "欄位未正確填寫"));

    const users = await User.findOne({
      _id: user._id
    }).select("+password");
    const compare = await bcrypt.compare(oldPassword, users.password);
    if (!compare)
      return next(appError(400, "您的舊密碼不正確!"));

    if (oldPassword === password)
      return next(appError(400, "新密碼不可與舊密碼相同"));

    if (password !== confirmPassword)
      return next(appError(400, "密碼不一致"));

    if (!validator.isLength(password, {min: 8}))
      return next(appError(400, "密碼數字低於 8 碼"));

    user.password = null;
    const newPassword = await bcrypt.hash(password, 12);
    await User.findByIdAndUpdate(req.user.id, {
      password: newPassword
    });

    res.status(200).json(getHttpResponse({
      message: "更新密碼成功"
    }));
  }),
  getProfile: handleErrorAsync(async (req, res) => {
    res.status(200).json(getHttpResponse({
      data: req.user
    }));
  }),
  updateProfile: handleErrorAsync(async (req, res, next) => {
    const {
      user,
      body: { nickName, gender },
    } = req;

    //需填寫內容
    if (!(nickName && gender))
      return next(appError(400, "請填寫修改資訊"));

    //名字需要2個字以上
    if (!validator.isLength(nickName, {min: 2}))
      return next(appError(400, "名字需要2個字以上"));

    //正確填寫性別
    if (!["male", "female"].includes(gender))
      return next(appError(400, "請正確填寫性別"));

    const currUser = await User.findByIdAndUpdate(user._id, {
      nickName,
      gender
    });

    const userData = Object.assign(currUser, { nickName, gender });
    res.status(200).json(getHttpResponse({
      data: userData
    }));
  })
};

module.exports = user;
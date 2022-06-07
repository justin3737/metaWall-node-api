const handleSuccess = require("../service/handleSuccess");
const { handleErrorAsync, appError } = require("../service/handleError");
const validator = require("validator");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs/dist/bcrypt");
const jwt = require("jsonwebtoken");

const generateSendJWT = (user, statusCode, res) => {
  // 產生 JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    data: {
      token,
      name: user.name
    }
  });
};

const user = {
  // 註冊會員
  signUp: handleErrorAsync(async (req, res, next) => {
    let {
      body: { name, email, password, confirmPassword },
    } = req;
    //內容不可為空
    if (!name || !email || !password || !confirmPassword)
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
      name
    });
    generateSendJWT(newUser, 201, res);
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

    generateSendJWT(user, 200, res);
  }),
  updatePassword: handleErrorAsync(async (req, res, next) => {
    const { password, confirmPassword } = req.body;
    //內容不可為空
    if (!password || !confirmPassword)
      return next(appError(400, "欄位未正確填寫"));

    if (!validator.isLength(password, {min: 8}))
      return next(appError(400, "密碼數字低於 8 碼"));

    if(password !== confirmPassword)
      return next(appError(400, "密碼不一致"));

    const newPassword = await bcrypt.hash(password, 12);
    const user = await User.findByIdAndUpdate(req.user.id, {
      password: newPassword
    });

    generateSendJWT(user, 200, res);
  }),
  getProfile: handleErrorAsync(async (req, res, next) => {
    handleSuccess(res, req.user);
  }),
  updateProfile: handleErrorAsync(async (req, res, next) => {
    const {
      user,
      body: { name, gender },
    } = req;
    //需填寫內容
    if (!(name && gender))
      return next(appError(400, "請填寫修改資訊"));

    //名字需要2個字以上
    if (!validator.isLength(name, {min: 2}))
      return next(appError(400, "名字需要2個字以上"));

    //正確填寫性別
    if (!["male", "female"].includes(gender))
      return next(appError(400, "請正確填寫性別"));

    const currUser = await User.findByIdAndUpdate(user._id, {
      name,
      gender
    });

    Object.assign(currUser, { name, gender });
    handleSuccess(res, currUser);
  })
};

module.exports = user;
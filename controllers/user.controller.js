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
      body: {
        email,
        password,
        nickName
      }
    } = req;
    const emailExist = await User.findOne({ email });

    if (!nickName) {
      return next(appError(400, "註冊失敗，請填寫暱稱欄位", "nickName"));
    } else if (!validator.isLength(nickName, { min: 2 })) {
      return next(appError(400, "暱稱至少 2 個字元以上", "nickName"));
    }

    if (!email) {
      return next(appError(400, "註冊失敗，請填寫 Email 欄位", "email"));
    } else if (!validator.isEmail(email)) {
      return next(appError(400, "Email 格式錯誤，請重新填寫 Email 欄位", "email"));
    } else if (emailExist) {
      return next(appError(400, "Email 已被註冊，請替換新的 Email", "email"));
    }

    if (!password) {
      return next(appError(400, "註冊失敗，請填寫 Password 欄位", "password"));
    } else if (!validator.isStrongPassword(password,
      {
        minLength: 8,
        minUppercase: 0,
        minSymbols: 0,
      })
    ) {
      return next(appError(400, "密碼需至少 8 碼以上，並英數混合", "password"));
    }

    password = await bcrypt.hash(req.body.password, 12); // 加密密碼
    const newUser = await User.create({
      email,
      password,
      nickName
    });
    const data = {
      token: await generateJwtToken(newUser._id),
      id: newUser._id
    };
    res.status(200).json(getHttpResponse({ data }));
  }),
  // 登入會員
  signIn: handleErrorAsync(async (req, res, next) => {
    const {
      body: { email, password }
    } = req;
    if (!email) {
      return next(appError(400, "登入失敗，請重新填寫 Email 欄位", "email"));
    } else if (!validator.isEmail(email)) {
      return next(appError(400, "Email 格式錯誤，請重新填寫 Email 欄位", "email"));
    }

    if (!password) {
      return next(appError(400, "登入失敗，請重新填寫 Password 欄位", "password"));
    } else if (!validator.isStrongPassword(password,
      {
        minLength: 8,
        minUppercase: 0,
        minSymbols: 0,
      })
    ) {
      return next(appError(400, "密碼需至少 8 碼以上，並英數混合", "password"));
    }

    const user = await User.findOne({ email }).select("+password"); // 顯示密碼
    if (!user) {
      return next(appError(400, "Email 填寫錯誤或尚未註冊", "email"));
    }

    const auth = await bcrypt.compare(password, user.password); // 比對密碼
    if (!auth) {
      return next(appError(400, "登入失敗，密碼不正確", "password"));
    }
    const data = {
      token: await generateJwtToken(user._id),
      id: user._id
    };
    res.status(200).json(getHttpResponse({ data }));
  }),
  //更新密碼
  updatePassword: handleErrorAsync(async (req, res, next) => {
    const {
      user,
      body: {
        oldPassword,
        password,
        confirmPassword
      }
    } = req;

    //內容不可為空
    if (!oldPassword || !password || !confirmPassword) {
      return next(appError(400, "欄位未正確填寫"));
    }
    const users = await User.findOne({
      _id: user._id
    }).select("+password");
    const compare = await bcrypt.compare(oldPassword, users.password);
    if (!compare) {
      return next(appError(400, "您的舊密碼不正確!"));
    } else if (oldPassword === password) {
      return next(appError(400, "新密碼不可與舊密碼相同"));
    } else if (password !== confirmPassword) {
      return next(appError(400, "密碼不一致"));
    } else if (!validator.isLength(password, {min: 8})) {
      return next(appError(400, "密碼數字低於 8 碼"));
    }

    user.password = null;
    const newPassword = await bcrypt.hash(password, 12);
    await User.updateOne({ _id: user._id }, { password: newPassword });
    res.status(200).json(getHttpResponse({ message: "更新密碼成功" }));
  }),
  // 取得個人資料
  getProfile: handleErrorAsync(async (req, res) => {
    const { user } = req;
    res.status(200).json(getHttpResponse({ data: user }));
  }),
  updateProfile: handleErrorAsync(async (req, res, next) => {
    const {
      user,
      body: {
        nickName,
        gender,
        avatar
      }
    } = req;

    if (!nickName) {
      return next(appError(400, "更新失敗，請填寫暱稱欄位"));
    } else if (typeof gender === Number) {
      return next(appError(400, "更新失敗，請填寫性別欄位"));
    } else if (!validator.isLength(nickName, { min: 2 })) {
      return next(appError(400, "暱稱至少 2 個字元以上"));
    } else if (avatar && !avatar.startsWith("https")) {
      return next(appError(400, "更新失敗，請確認大頭照的圖片網址"));
    }

    await User.findByIdAndUpdate(user._id, { nickName, gender, avatar });
    res.status(201).json(getHttpResponse({ message: "更新個人資料成功" }));
  })
};

module.exports = user;
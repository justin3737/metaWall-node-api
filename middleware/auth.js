const User = require("../models/users.model");
const { handleErrorAsync, appError } = require("../service/handleError");
const { errorMsg } = require("../service/enum");
const jwt = require("jsonwebtoken");

/**
 * 取得 JSON Web Token
 * @param {object} user 會員資訊
 * @returns {string}
 */
const generateJwtToken = async function (userId = "") {
  let token = "";
  if (userId) {
    token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES
    });
  }
  return token;
};

/**
 * 取得解密的 JSON Web Token
 * @param {string} token JSON Web Token
 * @returns {string}
 */
const getDecryptedJWT = (token) => jwt.verify(token, process.env.JWT_SECRET);

const isAuth = handleErrorAsync(async (req, res, next) => {
  const {
    headers: { authorization = "" },
  } = req;
  let token = "";
  if (authorization.startsWith("Bearer")) {
    token = authorization.split(" ")[1];
  }

  if (!token) {
    return next(appError(401, errorMsg.auth));
  }
  const decryptedData = getDecryptedJWT(token);
  if (!decryptedData) return next(appError(401, errorMsg.auth));

  const user = await User.findById(decryptedData.id);
  if (!user) return next(appError(401, errorMsg.auth));

  req.user = user;
  next();
});

module.exports = {
  isAuth,
  generateJwtToken
};
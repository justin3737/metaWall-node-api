const jwt = require("jsonwebtoken");

/**
 * 取得 JSON Web Token
 * @param {object} user 會員資訊
 * @returns {string}
 */
const getJWT = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY,
  });

/**
 * 取得解密的 JSON Web Token
 * @param {string} token JSON Web Token
 * @returns {string}
 */
const getDecryptedJWT = (token) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = {
  getJWT,
  getDecryptedJWT,
};

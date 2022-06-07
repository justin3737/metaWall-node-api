const User = require("../models/users.model");
const { handleErrorAsync, appError } = require("../service/handleError");
const { getDecryptedJWT } = require("../service/auth");
const { errorMsg } = require("../service/enum");

const auth = handleErrorAsync(async (req, res, next) => {
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


module.exports = auth;
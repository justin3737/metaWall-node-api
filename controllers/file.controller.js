const handleSuccess = require("../service/handleSuccess");
const { ImgurClient } = require('imgur');
const { appError, handleErrorAsync } = require("../service/handleError");
const uploadCore = require('../service/upload')

const upload = handleErrorAsync(async (req, res, next) => {
  uploadCore(req, res, async (err) => {
    if (err) {
      return next(appError(400, err));
    }
    if (!req.files.length) {
      return next(appError(400,"尚未上傳檔案"));
    }
    const client = new ImgurClient({
      clientId: process.env.IMGUR_CLIENT_ID,
      clientSecret: process.env.IMGUR_CLIENT_SECRET,
      refreshToken: process.env.IMGUR_REFRESH_TOKEN,
    });
    const response = await client.upload({
      image: req.files[0].buffer.toString('base64'),
      type: 'base64',
      album: process.env.IMGUR_ALBUM_ID
    });
    handleSuccess(res, {
      imgUrl: response.data.link
    });
  });
});

module.exports = {
  upload
};
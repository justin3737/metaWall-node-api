const multer = require("multer");
const path = require("path");
const { ImgurClient } = require('imgur');
const { appError, handleErrorAsync } = require("../service/handleError");

const multerSettings = {
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg') {
      cb('檔案格式錯誤，僅限上傳 jpg、jpeg 與 png 格式。');
    }
    cb(null, true);
  }
};

const uploadCore = multer(multerSettings).any();

const upload = handleErrorAsync(async (req, res, next) => {
  uploadCore(req, res, async (err) => {
    if(!req.files.length) {
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
    res.status(200).json({
      status:"success",
      imgUrl: response.data.link
    })
  });
});

module.exports = {
  upload
};
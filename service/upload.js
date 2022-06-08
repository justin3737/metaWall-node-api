const multer = require("multer");
const path = require("path");

const multerSettings = {
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg') {
      cb({message: '檔案格式錯誤，僅限上傳 jpg、jpeg 與 png 格式。'});
    }
    cb(null, true);
  }
};

const uploadCore = multer(multerSettings).any();

module.exports = uploadCore
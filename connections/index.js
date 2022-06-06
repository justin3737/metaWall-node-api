const mongoose = require("mongoose");
const dotenv = require("dotenv");

// 全域變數套件設定
if (process.env.NODE_ENV === "dev") {
  dotenv.config({ path: "./local.env" });
}else{
  dotenv.config({ path: "./config.env" });
}

// 遠端連線
const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);
mongoose.connect(DB)
  .then(() => {console.log("資料庫連線成功");})
  .catch(err => {console.log("資料庫連線失敗", err);});


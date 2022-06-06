var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const { appError } = require("./service/handleError");

// router
var postsRouter = require("./routes/posts");
var usersRouter = require("./routes/users");

var app = express();

require("./connections");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/posts", postsRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  return next(appError(404, "找無此路由"));
});


/* 錯誤處理 */
require("./service/processCatch");
const { errorHandlerMainProcess } = require("./service/handleError");
app.use(errorHandlerMainProcess);

module.exports = app;

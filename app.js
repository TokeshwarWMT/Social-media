require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
const fileUpload = require('express-fileupload');

var usersRouter = require('./routes/users');
var postRouter = require('./routes/posts');
var commentRouter = require('./routes/comment');
var likeRouter = require('./routes/likes');
var replyRouter = require('./routes/reply');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload({
  useTempFiles: true
}));

app.use('/users', usersRouter);
app.use('/posts', postRouter);
app.use('/comments', commentRouter);
app.use('/likes', likeRouter);
app.use('/reply', replyRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

mongoose.connect(process.env.DB_URL)
  .then(() => console.log('MongoDB connection Successful!!'))
  .catch(e => console.log(e))

const port = 5000;

app.listen(port, () => {
  console.log(`Express Server is running on 5000`);
});

module.exports = app;

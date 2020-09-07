var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/userRouter');
const dishRouter = require('./routes/dishRouter');
const promoteRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');

mongoose.connect("mongodb+srv://vilela:vilela@cluster0-fysn2.mongodb.net/<dbname>?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
  console.log("Connected to mongodb")
})


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


function auth(req, res, next) {
  console.log(req.headers);
  const authHeader = req.headers.authorization;

  if (!authHeader) {
      var err = new Error('You are not authenticated!');

      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
  }

  const auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':');

  var username = auth[0];
  var password = auth[1];

  if (username === 'admin' && password === 'password') {
      next();
  } else {
      var err = new Error('You are not authenticated!');

      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
  }
}

app.use(auth);


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
app.use('/promotions', promoteRouter);
app.use('/leaders', leaderRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

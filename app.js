var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs')
var logDate = require('./logDate')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// let myfunc = (tokens, req, res) => {
//  return [
//   tokens.method(req, res),
//   tokens.url(req, res),
//   tokens.status(req, res),
//   tokens.res(req, res, 'content-length') ,
//   tokens['response-time'](req, res), 'ms'
// ].join(' ')
// }

// morgan(function (tokens, req, res) {
//   return [
//     tokens.method(req, res),
//     tokens.url(req, res),
//     tokens.status(req, res),
//     tokens.res(req, res, 'content-length') ,
//     tokens['response-time'](req, res), 'ms'
//   ].join(' ')
// })
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.txt'), { flags: 'a' })
logger.token('response', (req, res) => {
  if (!res._header || !req._startAt) return '';
  const diff = process.hrtime(req._startAt);
  let ms = diff[0] * 1e3 + diff[1] * 1e-6;
  ms = ms.toFixed(0);
  return `${ms.toString().padStart(2, '0')}ms`;
});

app.use(
  logger(':method :url :status :response\n', {
    stream: accessLogStream
  })
);

// app.use(logger(function (tokens, req, res) {
//   return [ [
//     tokens.method(req, res),
//     tokens.url(req, res),
//     tokens.status(req, res)].join(' '),
//     // tokens.res(req, res, 'content-length'), '-',
//     [tokens[`response-time`](req, res), 'ms'].join('')
//   ].join(' ')
// }, { stream: accessLogStream }));
// app.use(logger(':method :url :status :response-time ms', { stream: accessLogStream }))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/on-covid-19', indexRouter);
app.use('/users', usersRouter);

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

module.exports = app;

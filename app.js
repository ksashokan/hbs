var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var userRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var hbs = require('express-handlebars');
var fileUpload = require('express-fileupload');
var session = require('express-session');
var db = require('./config/connection')
var app = express();
var hbsn = hbs.create({});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layout/',partialsDir:__dirname+'/views/partials/'}))

// app.engine('hbs', hbs.engine({
//   extname: 'hbs',
//   defaultLayout: 'layout',
//   layoutsDir: __dirname + '/views/layout/',
//   partialsDir: __dirname + '/views/partials/'
// }))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload())
app.use(session({secret:"key",cookie:{maxAge:600000}}))
// app.use(crypto());


db.connect((err) =>{
  if(err) console.log("Connection Error"+err)
  else console.log("Database connected")
})

app.use('/', userRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // res.locals.toastr = req.toastr.render();

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


hbsn.handlebars.registerHelper("eq", function(string1, string2, options) {
  var str1 = string1.toString();
  var str2 = string2.toString();
  if (str1 === str2) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});


module.exports = app;

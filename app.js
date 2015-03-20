var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var feed = require("./routes/feed");
var publish = require("./routes/publish");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/feed', feed);
app.use("/publish", publish);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// TODO: move these to the main route (aka controller)

// Initialize and populate imitation database.
var database = require("./database.js");

database.createGroup("CrackerJack473","CPSC 473 - Web Design Group");
database.createGroup("videogames","Videogames Group"); // Placeholder
database.createGroup("animals","Animals Group"); // Placeholder

database.createUser("jmovius",
    "955C4C87F9F8BA4CFC2F8888DB882B31954160FBFF7EB24DD81EBC0F71A21E6772368EA3ACB479BDA154995B3AB4AE14786CC6841C9C913572B2FA875A814DF1",
    "jmovius@nomail.com",
    ["CrackerJack473","videogames","animals"]);

database.createUser("tempuser",
    "7F5DB9C31A86321002D68796A99F5D7527F42F61B5CE116167C571411FA14B3EFD4904D5D0EF2E3428EB0BAE3D5F5C642BC9EBD650927791805A59B8C4E8FC5D",
    "tempuser@nomail.com",
    ["CrackerJack473"]);

// end of code to be refactored and moved

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

#!/usr/bin/env node
/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */
"use strict";

var express = require("express");
var path = require("path");
// var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");

var routes = require("./routes/index");
var login = require("./routes/login");
var feed = require("./routes/feed");
var publish = require("./routes/publish");
var users = require("./routes/users");
var posts = require("./routes/posts");

var app = express();

// mongoose is the mongodb driver
var mongoose = require("mongoose");

// connect to mongodb database which is called crackerjack
mongoose.connect("mongodb://localhost/crackerjack");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Create user session
app.use(session({
	secret: "f4tk4t4u",
	resave: true,
	saveUninitialized: true
}));

// to serve static files
app.use(express.static(path.join(__dirname, "public")));

app.use("/", routes);
app.use("/login", login);
app.use("/feed", feed);
app.use("/publish", publish);
app.use("/users", users);
app.use("/posts", posts);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: {}
  });
});


module.exports = app;

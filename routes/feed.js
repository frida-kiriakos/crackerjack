#!/usr/bin/env node
/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */
"use strict";

var express = require("express");
var router = express.Router();

var credentials = require("../credentials.json"),
    feed = [];

var Twitter = require("twitter");
 
var twitterClient = new Twitter(credentials);

var params = {screen_name: "CrackerJack473"};

router.get("/", function(req, res) {
  if(!req.session.isAuthorized) {
    return res.redirect("/login");
  }
  
  twitterClient.get("statuses/user_timeline", params, function(error, tweets) {
    if (!error) {
      tweets.forEach(function (t) {
        feed.push(t.text);  
      });
      
      res.json(feed);     
    } else {
      res.send(error);
    }
  });
});

module.exports = router;
#!/usr/bin/env node
/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */
"use strict";

var express = require("express");
var router = express.Router();
var Post = require("../models/post");
// var User = require("../models/user");

// TODO: open credentials based on the group
var credentials = require("../credentials.json");

var Twitter = require("twitter");
 
var twitterClient = new Twitter(credentials);

// publish to twitter function, accepts the post id to be published as a parameter
// can also check here if the current_user is an admin
router.get("/:post_id", function(req, res) {
    if(!req.session.isAuthorized && req.session.isAdmin) {
        return res.redirect("/login");
    }
  
    Post
    .findOne({_id: req.params.post_id})
    .populate("author")
    .exec(function (err, post ) {
        if (err) {
            console.log(err);
            return res.redirect("/");
        }

        twitterClient.post("statuses/update", { status: post.body },  function(error) {
            if (!error) {
                post.published = true;
                post.save();
                return res.json("success");
            } else {
                console.log("error: " + JSON.stringify(error));
                return res.json("error");
            }
        });
    });
});

module.exports = router;
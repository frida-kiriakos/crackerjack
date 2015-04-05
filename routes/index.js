#!/usr/bin/env node
/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */
"use strict";

var express = require("express");
var router = express.Router();
var Post = require("../models/post");
// var User = require("../models/user");

// check if the user is logged in
// render the login page if not logged in and render the main page if logged in

router.get("/", function(req, res) {
	if(!req.session.isAuthorized) {
		return res.redirect("/login");
	}
	
	// the following query retrieves all posts and populates the author object to retrieve the owner of the post
	// the result is sorted by number of upvotes (desc) and downvotes (asc)
	Post
	.find()
	.populate("author")
	.sort({upvotes: -1, downvotes: 1})
	.exec(function (err, posts) {
		if (err) {
			console.log(err);
			res.render("index");
		}
		res.render("index", {
			session: req.session,
    		username: req.session.username,
    		isAdmin: req.session.isAdmin,
			posts: posts
		});
	});
	
});

module.exports = router;

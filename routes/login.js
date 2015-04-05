#!/usr/bin/env node
/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */
"use strict";

var express = require("express");
var router = express.Router();
var User = require("../models/user");
// var Group = require("../models/group");

/* GET login page. */
router.get("/", function (req, res) {
	req.session.destroy();
	res.render("login", { title: "Cracker Jack" });
});

/* POST login form. */
router.post("/", function (req, res) {

	User.findOne({username: req.body.username}, function(err, user) {
		if (err || !user) {
			req.session.isAuthorized = false;
			console.log("User Not Found - isAuthorized: " + req.session.isAuthorized);
			return res.redirect("/login");
		} else {
			if(user.password === req.body.password) {
				req.session.isAuthorized = true;
				req.session.isAdmin = user.admin;
				req.session.username = user.username;
				
				return res.redirect("/");
			} else {
				req.session.isAuthorized = false;
				console.log("Incorrect Password - isAuthorized: " + req.session.isAuthorized);
				return res.redirect("/login");
			}
		}
	});
});

module.exports = router;
var express = require('express');
var router = express.Router();
var User = require("../models/user");
var Group = require("../models/group");

/* GET login page. */
router.get('/', function (req, res, next) {
	req.session.destroy();
	res.render('login', { title: 'Cracker Jack' });
});

/* POST login form. */
router.post('/', function (req, res, next) {
	console.log("Entered  - UN: " + req.body.username + "; PW: " + req.body.password + ";");

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
				//console.log("login - user.username: " + user.username);
				//console.log("login - session.username: " + req.session.username);
				console.log("Success - isAuthorized: " + req.session.isAuthorized);
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
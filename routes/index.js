var express = require('express');
var router = express.Router();
var Post = require("../models/post");
var User = require("../models/user");

// can I check if the user is logged in from here?
// if so render the login page if not logged in and render the main page if logged in
/* GET home page. */
router.get('/', function(req, res, next) {
	if(!req.session.isAuthorized) {
		res.redirect("/login");
	}
	
	// the following query retrieves all posts and populates the author object to retrieve the owner of the post
	Post
	.find()
	.populate("author")
	.exec(function (err, posts) {
		if (err) {
			console.log(err);
			res.render("index");
		}
		res.render('index', {
    		username: req.session.username,
			posts: posts
		});
	});
	
});

module.exports = router;

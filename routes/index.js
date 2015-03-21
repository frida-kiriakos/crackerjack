var express = require('express');
var router = express.Router();
var Post = require("../models/post");
var User = require("../models/user");

// can I check if the user is logged in from here?
// if so render the login page if not logged in and render the main page if logged in
/* GET home page. */
router.get('/', function(req, res, next) {
	// the following query retrieves the posts by a certain user
	// User
	// .findOne({username: "frida"})
	// .populate("posts")
	// .exec(function (err, user) {
	//   if (err) return handleError(err);
	//   console.log("posts by: " + user.username + " : " + user.posts);
	//   res.render('index', { posts: user.posts });
	// });
	
	// the following query retrieves all posts and populates the author object to retrieve the owner of the post
	Post
	.find()
	.populate("author")
	.exec(function (err, posts) {
		if (err) {
			console.log(err);
			res.render("index");
		}
		// console.log("posts: " + posts);
		res.render('index', { posts: posts });
	});
	
});

module.exports = router;

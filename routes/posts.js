var express = require("express");
var router = express.Router();
var Post = require("../models/post");
var User = require("../models/user");

router.post("/new", function(req,res,next) {
	console.log(req.body.tweetBody);
	User.findOne({username: req.body.username}, function(err, user) {
		if (err) {
			console.log("user not found");
			res.redirect("/");
		}
		console.log("user: " + user.username);

		var post = new Post({
			author: user._id,
			body: req.body.tweetBody,
			upvotes: 0,
			downvotes: 0,
			upvoters: [],
			downvoters: []
		});

		post.save(function(err) {
			if (err) {
				console.log("error saving post:" + err);
			} else {
				// add the post to the list of posts owned by the user
				user.posts.push(post);
				user.save();
				console.log("post created successfully");
			}
			
			res.redirect("/");
		});

	});
	



	

	// user.save(function(err) {
	// 	if (err) {
	// 		console.log("error saving user:" + err);
	// 		res.redirect("/");
	// 	}

	// 	post.author = user;
	// 	console.log("post author" + post.author.username);
		
	// });
	
});

module.exports = router;
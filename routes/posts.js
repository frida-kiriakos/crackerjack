var express = require("express");
var router = express.Router();
var Post = require("../models/post");
var User = require("../models/user");

// create a new post, called using /posts/new
// takes form parameters tweetBody and username
// creates the post, adds it to the user posts array then redirects to the index page
router.post("/new", function(req,res,next) {
	if(!req.session.isAuthorized) {
		return res.redirect("/login");
	}
	
	User.findOne({username: req.session.username}, function(err, user) {
		if (err || req.body.tweetBody === "") {
			console.log("User not found or empty post.");
			return res.redirect("/");
		} else if (req.body.tweetBody.length > 140) {
			// TODO: we need to retain the tweetBody after we return from the error, or add client side validation 
			console.log("tweet body is greater than 140 characters");
			req.session.tweetError = "Tweet body is greater than 140 characters";
			return res.redirect("/");
		}
		console.log("user: " + user.username);

		var post = new Post({
			author: user._id,
			body: req.body.tweetBody,
			upvotes: 0,
			downvotes: 0,
			upvoters: [],
			downvoters: [],
			published: false
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
			
			return res.redirect("/");
		});

	});	
});

// get all posts, called by using /posts
// returns posts array and user object can be accessed using post.author
router.get("/", function(req,res,next) {
	Post
	.find()
	.populate("author")
	.exec(function (err, posts) {
		if (err) {
			console.log(err);
			res.send("an error occured");
		}
		// console.log("posts: " + posts);
		res.json(posts);
	});
});

// get posts for a certain user, takes the username as a parameter: example call: /posts/frida
// returns the user object
// the user's post can be retrieved using user.posts
router.get("/:username", function(req,res,next) {
	// the following query retrieves the posts by a certain user
	User
	.findOne({username: req.params.username})
	.populate("posts")
	.exec(function (err, user) {
		if (err) {
			console.log(err);
			res.send("an error occured");
		}
		// console.log("posts by: " + user.username + " : " + user.posts);
		res.json(user);
	});
	
});

router.get("/upvote/:id", function(req, res, next) {
	Post
	.findOne({_id: req.params.id})
	// .populate("author")
	.exec(function (err, post) {
		if (err) {
			console.log(err);
			return res.redirect("/");
		}

		// check if the logged in user has already voted on the post
		User
		.findOne({username: req.session.username})
		.exec(function(err, user) {
			if (err) {
				console.log(err);
				return res.redirect("/");
			} else {
				if (post.upvoters.indexOf(user._id) > -1) {
					// user already voted
					console.log("user already upvoted");
					return res.redirect("/");
				} else {
					post.upvotes = post.upvotes + 1;
					post.upvoters.push(user._id);
					post.save();
					return res.redirect("/");
				}
			}
		});
		
	});
});

// voting can be refactored to reduce redundancy
router.get("/downvote/:id", function(req, res, next) {
	Post
	.findOne({_id: req.params.id})
	// .populate("author")
	.exec(function (err, post) {
		if (err) {
			console.log(err);
			return res.redirect("/");
		}
		// check if the logged in user has already voted on the post
		User
		.findOne({username: req.session.username})
		.exec(function(err, user) {
			if (err) {
				console.log(err);
				return res.redirect("/");
			} else {
				if (post.downvoters.indexOf(user._id) > -1) {
					// user already voted
					console.log("user already downvoted");
					return res.redirect("/");
				} else {
					post.downvotes = post.downvotes + 1;
					post.downvoters.push(user._id);
					post.save();
					return res.redirect("/");
				}
			}
		});
	});
});

module.exports = router;
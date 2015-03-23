var express = require("express");
var router = express.Router();
var Post = require("../models/post");
var User = require("../models/user");

// create a new post, called using /posts/new
// takes form parameters tweetBody and username
// creates the post, adds it to the user posts array then redirects to the index page
router.post("/new", function(req,res,next) {
	if(!req.session.isAuthorized) {
		res.redirect("/login");
	}
	
	console.log(req.body.tweetBody);
	User.findOne({username: req.session.username}, function(err, user) {
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
			
			res.redirect("/");
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
	.populate("author")
	.exec(function (err, post) {
		if (err) {
			console.log(err);
			res.redirect("/");
		}
		// TODO: check first if current_user is in the upvoters list
		post.upvotes = post.upvotes + 1;
		// TODO: add the logged in user id to the list of upvoters
		// post.upvoters.push(current_user._id);
		post.save();
		res.redirect("/");
	});
});

router.get("/downvote/:id", function(req, res, next) {
	Post
	.findOne({_id: req.params.id})
	.populate("author")
	.exec(function (err, post) {
		if (err) {
			console.log(err);
			res.redirect("/");
		}
		// TODO: check first if current_user is in the downvoters list
		post.downvotes = post.downvotes + 1;
		// TODO: add the logged in user id to the list of downvoters
		// post.downvoters.push(current_user._id);
		post.save();
		res.redirect("/");
	});
});

module.exports = router;
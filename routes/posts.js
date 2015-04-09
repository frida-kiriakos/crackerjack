#!/usr/bin/env node
/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */
"use strict";

var express = require("express");
var router = express.Router();
var Post = require("../models/post");
var User = require("../models/user");

// create a new post, called using /posts/new
// takes form parameters tweetBody and username
// creates the post, adds it to the user posts array then redirects to the index page
router.post("/new", function(req,res) {
	if(!req.session.isAuthorized) {
		//return res.redirect("/login");
		return res.json();
	}
	
	User.findOne({username: req.session.username}, function(err, user) {
		if (err || req.body.tweetBody === "") {
			console.log("User not found or empty post.");
			return res.redirect("/");
		} else if (req.body.tweetBody.length > 140) {
			// TODO: we need to retain the tweetBody after we return from the error, or add client side validation 
			console.log("tweet body is greater than 140 characters");
			req.session.tweetError = "Tweet body is greater than 140 characters";
			return res.json("error");
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
			
			return res.json("success");
		});
	});	
});

// get all posts, called by using /posts
// returns posts array and user object can be accessed using post.author
router.get("/", function(req,res) {
	Post
	.find()
	.populate("author")
	.sort({upvotes:-1, downvotes:1})
	.exec(function (err, posts) {
		var postsObj = [];
		if (err) {
			console.log(err);
			res.send("an error occured");
		}

		User
		.count(function (err, count) {
			if (err) {
				console.log(err);
				res.send("an error occurred");
			}

			posts.forEach(function(post) {
				if (post.published === false) {
					postsObj.push({
						body: post.body,
						username: post.author.username,
						votes: (post.upvotes - post.downvotes),
						btn_edit: (post.author.username === req.session.username) ? "true" : "false",
						btn_vote: (post.author.username !== req.session.username) ? "true" : "false",
						btn_publish: (req.session.isAdmin && ((post.upvotes - post.downvotes) >= (count / 2))) ? "true" : "false",
						id: post._id
					});
				}
			});
			res.json(postsObj);
		});
	});
});

// get posts for a certain user, takes the username as a parameter: example call: /posts/frida
// returns the user object
// the user's post can be retrieved using user.posts
router.get("/:username", function(req,res ) {
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

// edit post api, takes parameters post_id and post_body as the post data
// in the AJAX request, use data: {post_id: <the id of the post>, post_body: <the updated post>}
// tested with curl request curl --silent --request POST --data "post_id=551379d920a97ea82098b1be&post_body=testing edit" localhost:3000/posts/edit | python -m json.tool
router.post("/edit", function(req, res ) {
	Post
	.findOne({_id: req.body.post_id})
	.populate("author")
	.exec(function (err, post) {
		if (err) {
			console.log(err);
			return res.json("error");
		} else {
			if (post.author.username === req.session.username || req.session.isAdmin) {
				post.body = req.body.post_body;
				post.save();
				return res.json("success");
			} else {
				console.log("you are not allowed to edit");
				return res.json("you are not allowed to edit");
			}
		}

	});
});

router.get("/upvote/:id", function(req, res ) {
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
				if (post.author._id !== user._id) {

					if (post.upvoters.indexOf(user._id) > -1) {
						// user already voted
						console.log("user already upvoted");
						return res.json("error");
					} else {
						// check whether the user has already downvoted on the post, in this case remove the user from the list of downvoters
						if (post.downvoters.indexOf(user._id) > -1) {
							post.downvoters.splice(post.downvoters.indexOf(user._id), 1);
							post.downvotes = post.downvoters.length;
						}
						post.upvoters.push(user._id);
						post.upvotes = post.upvoters.length;
						post.save();
						return res.json("success");
					}
				}
			}
		});
		
	});
});

// voting can be refactored to reduce redundancy
router.get("/downvote/:id", function(req, res ) {
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
				return res.json("error");
			} else {
				// check if the user voting is not the author
				if (post.author._id !== user._id) {
					if (post.downvoters.indexOf(user._id) > -1) {
						// user already voted
						console.log("user already downvoted");
						return res.json("error");
					} else {
						if (post.upvoters.indexOf(user._id) > -1) {
							post.upvoters.splice(post.upvoters.indexOf(user._id), 1);
							post.upvotes = post.upvoters.length;
						}
						post.downvoters.push(user._id);
						post.downvotes = post.downvoters.length;
						post.save();
						return res.json("success");
					}
				}
			}
		});
	});
});

// Cancel vote.
router.get("/cancelvote/:id", function(req, res ) {
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
				return res.json("error");
			} else {
				if (post.author._id !== user._id) {
					if (post.downvoters.indexOf(user._id) > -1) {
						post.downvoters.splice(post.downvoters.indexOf(user._id), 1);
						post.downvotes = post.downvoters.length;
					}
					if (post.upvoters.indexOf(user._id) > -1) {
						post.upvoters.splice(post.upvoters.indexOf(user._id), 1);
						post.upvotes = post.upvoters.length;
					}
					post.save();
					return res.json("success");
				}
			}
		});
	});
});

module.exports = router;

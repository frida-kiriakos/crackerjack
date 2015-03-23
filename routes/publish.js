var express = require('express');
var router = express.Router();
var Post = require("../models/post");
var User = require("../models/user");

// TODO: open credentials based on the group
var credentials = require("../credentials.json"),
    feed = [];

var Twitter = require("twitter");
 
var twitterClient = new Twitter(credentials);

// TODO: set the screen_name based on the group
var params = {screen_name: "CrackerJack473"};

// publish to twitter function, accepts the post id to be published as a parameter
// can also check here if the current_user is an admin
router.get("/:post_id", function(req, res, next) {
  if(!req.session.isAuthorized) {
    res.redirect("/login");
  }
  
  Post
  .findOne({_id: req.params.post_id})
  .populate("author")
  .exec(function (err, post ) {
    if (err) {
      console.log(err);
      res.redirect("/");
    }

    twitterClient.post("statuses/update", {status: post.body},  function(error, t, response) {
      if (!error) {
        post.published = true;
        post.save();
        res.redirect("/");
      } else {
        console.log("error: " + JSON.stringify(error));
        res.redirect("/");
      }
      
    });
  });
});

module.exports = router;
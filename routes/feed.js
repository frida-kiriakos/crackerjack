var express = require('express');
var router = express.Router();

var credentials = require("../credentials.json"),
    feed = [];

var Twitter = require("twitter");
 
var twitterClient = new Twitter(credentials);

var params = {screen_name: "CrackerJack473"};

router.get('/', function(req, res, next) {
  if(!req.session.isAuthorized) {
    return res.redirect("/login");
  }
  
  twitterClient.get("statuses/user_timeline", params, function(error, tweets, response) {
    if (!error) {
      tweets.forEach(function (t) {
        feed.push(t.text);  
      });
      
      res.json(feed);     
    } else {
      // console.log("ERROR: " + JSON.stringify(error));
      res.send(error);
    }
  });
});

module.exports = router;
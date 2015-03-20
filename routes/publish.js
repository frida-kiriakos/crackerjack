var express = require('express');
var router = express.Router();

var credentials = require("../credentials.json"),
    feed = [];

var Twitter = require("twitter");
 
var twitterClient = new Twitter(credentials);

var params = {screen_name: "CrackerJack473"};

router.post('/', function(req, res, next) {
  // TODO: validate the input received
  twitterClient.post("statuses/update", {status: req.body.tweet},  function(error, t, response) {
    if (!error) {
      res.json({"message":"SUCCESS: Tweet Published"});
    } else {
      console.log("ERROR: " + JSON.stringify(error));
      res.json(error);
    }
    
  });
});

module.exports = router;
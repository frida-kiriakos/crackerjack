#!/usr/bin/env node
/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */

"use strict";

var express = require("express"),
    http = require("http"),
    app = express(),
    credentials = require("./credentials.json"),
    feed = [];

var Twitter = require("twitter");
 
var twitterClient = new Twitter(credentials);

var params = {screen_name: "CrackerJack473"};


app.use(express.static(__dirname + "/client"));
app.use(express.json());       // to support JSON-encoded request body
app.use(express.urlencoded()); // to support URL-encoded request body

app.get("/feed", function(req, res) {
	twitterClient.get("statuses/user_timeline", params, function(error, tweets, response){
		if (!error) {
			tweets.forEach(function (t) {
				feed.push(t.text);	
			});
			res.json(feed);			
		}
	});
});

app.post("/publish", function(req, res) {
	console.log("I will publish the tweet to twitter");
	console.log(req.body.tweet);
	// TODO: validate the input received
	twitterClient.post("statuses/update", {status: req.body.tweet},  function(error, t, response){
		if (error) {
			console.log("error:");
			res.json({"message":"An error occurred!"});
			throw error;
		}
		// console.log(t);  // Tweet body. 
		// console.log(response);  // Raw response object. 
	});

	res.json({"message":"Tweet is published successfully!"});

});

http.createServer(app).listen(3000);

console.log("Server running on port 3000");
#!/usr/bin/env node
/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */

"use strict";

var express = require("express"),
    http = require("http"),
    app = express();

app.use(express.static(__dirname + "/client"));
app.use(express.json());       // to support JSON-encoded request body
app.use(express.urlencoded()); // to support URL-encoded request body

app.post("/publish", function(req, res) {
	console.log("I will publish the tweet to twitter");
	console.log(req.body.tweet);

	res.json({"message":"Tweet is published successfully!"});

});

http.createServer(app).listen(3000);

console.log("Server running on port 3000");
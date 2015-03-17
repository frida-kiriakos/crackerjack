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


//////////////////////////////////////////////////////
/* Fake Database and Initialization Functions Begin */
    database = {
    	users: {},
    	groups: {}
    };
    /* // This specific setup allows the "database" to pull the data of a user VERY easily. For example,
     * // to pull up my user account information under my login username "jmovius", use the following:
     * // var user = database.users.jmovius;
     * // if(inputPassword === user.password) { console.log("Password check passed!"); } else { console.log("Password check failed."); }
	 * // Check if the user pulled actually exists: if(!user) { "true if user exists" } else { "false if user does not exist" }
     * users: {
     *		username: {
     *			username: "",
     *			password: "",
     *			email: "",
     *			groupList: [],
     *			submitted: 0, // Number of potential tweets submitted.
     *			published: 0 // Number of tweets that were published by this user.
	 *		}
     * },
     * // To pull up a group's information under "CrackerJack473", use the following:
     * // var group = database.groups.CrackerJack473;
     * // group.twitter // -> twitterAccountName
     * groups: {
     *		groupname: {
     * 			groupname: groupDetailedName,
     *			twitter: twitterAccountName,
     *			// Any other item that would be required to define a group and log into the associated twitter account.
     *		}
     *	}
     */

var createGroup = function (groupName,groupDetailedName,twitterAccountName) {
    if(!database.groups[groupName]) {
        database.groups[groupName] = {
        	groupname: groupDetailedName,
        	twitter: twitterAccountName
        };
    } else {
        console.log("Group already exists!");
    }
};

var createUser = function (un,pw,em,gl) {
    if(!database.users[un]) {
        database.users[un] = {
            username: un,
            password: pw,
            email: em,
            groupList: gl,
            submitted: 0,
            published: 0
        };
    } else {
        console.log("User already exists!");
    }
};

// Populate fake database.
createGroup("cpsc473","CPSC 473 - Web Design Group","CrackerJack473");
createGroup("videogames","VIdeogames Group","PLACEHOLDER");
createGroup("animals","Animals Group","PLACEHOLDER");

createUser("jmovius",
	"955C4C87F9F8BA4CFC2F8888DB882B31954160FBFF7EB24DD81EBC0F71A21E6772368EA3ACB479BDA154995B3AB4AE14786CC6841C9C913572B2FA875A814DF1",
	"jmovius@nomail.com",
	["cpsc473","videogames","animals"]);

createUser("tempuser",
	"7F5DB9C31A86321002D68796A99F5D7527F42F61B5CE116167C571411FA14B3EFD4904D5D0EF2E3428EB0BAE3D5F5C642BC9EBD650927791805A59B8C4E8FC5D",
	"tempuser@nomail.com",
	["cpsc473"]);
/* Fake Database and Initialization Functions End */
////////////////////////////////////////////////////


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
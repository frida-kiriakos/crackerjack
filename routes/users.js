var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Group = require("../models/group");

var users = {"frida": {
				_id:0, 
				username:"frida", 
				password:"test123",
				email:"frida@csu.fullerton.edu",
				groupList:["CrackerJack473"],
				admin: true },
			"john": {
				 _id:1, 
				username:"john", 
				password:"test123",
				email:"jmovius@nomail.com",
				groupList:["CrackerJack473"],
				admin: true }
			};
var groups = {"CrackerJack473": {
				groupname: "CrackerJack473", 
				displayname: "CPSC 473 - Web Design Group"},
			"videogames": {
				groupname: "videogames", 
				displayname: "Videogames Group"},
			};

router.get("/new/:username", function(req, res, next) {
	var newuser = new User(users[req.params.username]);

	newuser.save(function(err) {
		if (err) {
			console.log(err);
			res.send("error creating user");
		} else {
			res.send("user created successfully");
		}
	});
	
});

router.get('/:username', function(req,res,next){
	User.findOne({username: req.params.username}, function(err, user) {
		if (err) res.send("user not found");
		res.send(user);
	});
});

router.get('/delete/:id', function(req,res,next){
	User.remove({_id: req.params.id}, function(err) {
		if (err) res.send("user not found");
		res.send("user deleted successfully");
	});
});

router.get("/create_group/:group", function(req, res, next) {
	
	var group = new Group(groups[req.params.group]);

	group.save(function(err) {
		if (err) {
			console.log(err);
			res.send("error creating group");
		} else {
			res.send("group created successfully");
		}
	});
	
});

module.exports = router;
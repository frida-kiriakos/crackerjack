#!/usr/bin/env node
/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */
"use strict";

// source: http://mongoosejs.com/docs/guide.html, http://mongoosejs.com/docs/populate.html
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// If you want to add additional keys later, use the Schema#add method.
var usersSchema = new Schema({
// users object schema, I included with it the posts object for the posts owned by the user
// TODO: add a reference to the group
	_id     : Number,
	username: String,
    password: String,
    email: String,
    groupList: Array,
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    date: { type: Date, default: Date.now },
    submitted: Number,
    published: Number,
    admin: Boolean
});



// User model will be available to create new users or to query the database
module.exports = mongoose.model("User", usersSchema);

// now in the routes for example, can do var User = require("./models/user"); to use the User model
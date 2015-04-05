#!/usr/bin/env node
/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */
"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var groupsSchema = new Schema({
	groupname: String,
	displayname: String,
});

module.exports = mongoose.model("Group", groupsSchema);

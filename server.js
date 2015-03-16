#!/usr/bin/env node
/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */

"use strict";

var http = require("http"),
    server;

server = http.createServer(
	function(req, res) { 
		res.writeHead(200, {
			"content-type":"text/plain"
		});
		res.write("Hello World");
		res.end();
	}
);
// Client-side code
/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */
var main = function () {
	"use strict";

	// the below AJAX request is an example of using the /posts API, 
	// it will return the posts array and can be used below instead of the hard coded post
	// this is only if we need to modify our code to use AJAX
	$.getJSON("http://localhost:3000/posts", function(posts) {
		posts.forEach(function(post) {
			var $p = $("<p>");
			$p.text(post.body + " - Post By: " + post.author.username);
			// replace this with the correct tag ID
			// $("#pendingTweets").append($p);
		});
	});

// code from twitter to load the twitter widget on the index page 
	(function(d,s,id) { 
		var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?"http":"https";
		if(!d.getElementById(id)) { 
			js=d.createElement(s);
			js.id=id;
			js.src=p+"://platform.twitter.com/widgets.js";
			fjs.parentNode.insertBefore(js,fjs);
		}
	}(document,"script","twitter-wjs"));

	var _maxLength = 250,
		revertInput = "",
		inputUrl = "",
		originalLen = 0,
		$charLen = $("div .char-len"),
		$inputText = $("textarea.input-text").attr("maxlength",_maxLength).attr("placeholder","Input Tweet"),
		$btn_revert = $("<button>").text("Revert").attr("class", "btn btn-default").attr("disabled",true),
		$btn_shorten = $("<button>").text("Shorten").attr("class", "btn btn-default");

	var setCharLen = function(len) {
		if(len===0) {
			$btn_shorten.attr("disabled", true);
		}
		$charLen.text(len + "/" + _maxLength);
	};
	setCharLen(0);

	$inputText.on("keydown", function() {
		originalLen = $inputText.val().length;
	});

	$inputText.on("keyup", function() {
		if(originalLen !== $inputText.val().length) {
			setCharLen($inputText.val().length);
			$btn_revert.attr("disabled", true);
			$btn_shorten.attr("disabled", false);
		}
	});

	$btn_revert.on("click", function () {
		$inputText.val(revertInput);
		setCharLen(revertInput.length);
		$btn_revert.attr("disabled", true);
		$btn_shorten.attr("disabled", false);
	});

	$btn_shorten.on("click", function () {
		$btn_shorten.attr("disabled", true);
		if($inputText.val().length > 0) {
			revertInput = $inputText.val();

			inputUrl = "http://www.feathr.it/api?symbol=0&text=" + $inputText.val().replace(/ /g, "%20");

			// Feather.it API Call
			$.getJSON(inputUrl, function (response) {
				$inputText.val(response[0].Shorten_Text);
				setCharLen(response[0].Shorten_Text.length);
			});
		}
		$btn_revert.attr("disabled", false);
	});

	$("div .input-buttons").append($btn_revert, $btn_shorten);
};
$(document).ready(main);
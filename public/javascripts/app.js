// Client-side code
/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */
var main = function () {
	"use strict";

	var _maxLength = 250,
		revertInput = "",
		inputUrl = "",
		originalLen = 0,
		$charLen = $("div .char-len"),
		$inputText = $("textarea.input-text").attr("maxlength",_maxLength).attr("placeholder","Add the tweet you want to post here, so your group can vote on it. (NOTE: Posts must meet Twitter's 140 Character limit)"),
		$btn_revert = $("<button>").text("Revert").attr("class", "btn btn-default").attr("disabled",true),
		$btn_shorten = $("<button>").text("Shorten").attr("class", "btn btn-default"),
		$btn_post = $("<button>").text("Post").attr("class", "btn btn-primary");

	// the below AJAX request is an example of using the /posts API, 
	// it will return the posts array and can be used below instead of the hard coded post
	// this is only if we need to modify our code to use AJAX
	$btn_post.on("click", function () {
		$.post("/posts/new",{ tweetBody:$inputText.val() }).done(refreshPosts);
	});

	var refreshPosts = function () {
		// Reset text area.
		$inputText.val("");
		setCharLen(0);

		var $psts = $("div.unpublished"),
			$btns,
			up = "<span class=\"glyphicon glyphicon-arrow-up\"></span>",
			down = "<span class=\"glyphicon glyphicon-arrow-down\"></span>";

		$.getJSON("/posts", function(posts) {
			$psts.empty();
			posts.forEach(function(post) {
				$btns = $("<div>").attr("class", "post-btns");
				$psts.append($("<p>").attr("class", "post").text(post.body + " - Post By: " + post.username + " - Votes: " + post.votes));

				if (post.btn_edit === "true") {
					$btns.append($("<button>").attr("class", "upvote btn btn-default").bind("click", { id:post.id }, event_edit).text("Edit"));
				}
				if (post.btn_vote === "true") {
					$btns.append($("<button>").attr("class", "upvote btn btn-default").bind("click", { id:post.id }, event_upVote).html(up));
					$btns.append($("<button>").attr("class", "downvote btn btn-default").bind("click", { id:post.id }, event_downvote).html(down));
				}
				if (post.btn_publish === "true") {
					$btns.append($("<button>").attr("class", "publish btn btn-default").bind("click", { id:post.id }, event_publish).text("Publish to Twitter"));
				}

				$psts.append($btns);
			});
		});
	};

	// NOTE: Need to add server-side checks to prevent security issues.
	var event_edit = function (e) {
		alert("EDIT " + e.data.id);
	};
	var event_upVote = function (e) {
		alert("UP " + e.data.id);
	};
	var event_downvote = function (e) {
		alert("DOWN " + e.data.id);
	};
	var event_publish = function (e) {
		alert("PUBLISH " + e.data.id);
	};

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

	var setCharLen = function(len) {
		if(len===0) {
			$btn_shorten.attr("disabled", true);
			$btn_post.attr("disabled", true);
		} else if(len <= 140) {
			$btn_shorten.attr("disabled", true);
			$btn_post.attr("disabled", false);
		} else if(len > 139) {
			$btn_shorten.attr("disabled", false);
			$btn_post.attr("disabled", true);
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

	$("div .input-buttons").append($btn_post, $btn_revert, $btn_shorten);
	refreshPosts();
};
$(document).ready(main);
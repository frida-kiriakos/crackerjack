// Client-side code
/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */
var main = function () {
	"use strict";

	var _maxLength = 250,
		revertInput = "",
		inputUrl = "",
		originalLen = 0,
		editPostId = "",
		isPost = true, // Used to keep track of which function the enter key triggers in the inputText area.
		$charLen = $("div .char-len"),
		$inputText = $("textarea.input-text").attr("maxlength",_maxLength).attr("placeholder","Add the tweet you want to post here, so your group can vote on it. (NOTE: Posts must meet Twitter's 140 Character limit)"),
		$btn_revert = $("<button>").text("Revert").attr("class", "btn btn-default").attr("disabled",true),
		$btn_shorten = $("<button>").text("Shorten").attr("class", "btn btn-default"),
		$btn_post = $("<button>").text("Post").attr("class", "btn btn-primary"),
		$btn_update = $("<button>").text("Update").attr("class", "btn btn-primary"),
		$btn_cancelUpdate = $("<button>").text("Cancel").attr("class", "btn btn-primary");

	// the below AJAX request is an example of using the /posts API, 
	// it will return the posts array and can be used below instead of the hard coded post
	// this is only if we need to modify our code to use AJAX
	$btn_post.on("click", function () {
		$.post("/posts/new",{ tweetBody:$inputText.val() }).done(refreshPosts);
	});

	$btn_update.on("click", function () {
		$.post("/posts/edit",{ post_id:editPostId, post_body:$inputText.val() }).done(refreshPosts);
	});

	$btn_cancelUpdate.on("click", function () {
		$inputText.val("");
		setCharLen(0);
		btns_setPost();
	});

	var btns_setPost = function () {
		isPost = true;
		$btn_post.show();
		$btn_update.hide();
		$btn_cancelUpdate.hide();
	};

	var btns_setEdit = function () {
		isPost = false;
		$btn_post.hide();
		$btn_update.show();
		$btn_cancelUpdate.show();
	};

	var initTweets = function () {
		var $tweetsUrl = $("<a>").attr("class", "twitter-timeline")
					.attr("href", "https://twitter.com/CrackerJack473")
					.attr("data-widget-id", "575783346589974529")
					.attr("data-chrome", "noheader nofooter transparent")
					.attr("height", "498")
					.text("Tweets by @CrackerJack473");
		$("div.published").append($tweetsUrl);
	};

	var refreshPosts = function () {
		// Reset text area.
		$inputText.val("");
		setCharLen(0);

		var $psts = $("div.unpublished"),
			$btns,
			up = "<span class=\"glyphicon glyphicon-arrow-up\"></span>",
			down = "<span class=\"glyphicon glyphicon-arrow-down\"></span>",
			cancel = "<span class=\"glyphicon glyphicon-remove\"></span>";

		$.getJSON("/posts", function(posts) {
			$psts.empty();
			posts.forEach(function(post) {
				$btns = $("<div>").attr("class", "post-btns");
				$psts.append($("<p>").attr("id", post.id).attr("class", "post").html(post.body + "<div class=\"post-author-votes\"> - Post By: " + post.username + " - Votes: " + post.votes + "</div>"));

				if (post.btn_edit === "true") {
					$btns.append($("<button>").attr("class", "upvote btn btn-default").bind("click", { post:post }, event_edit).text("Edit"));
				}
				if (post.btn_vote === "true") {
					$btns.append($("<button>").attr("class", "upvote btn btn-default").bind("click", { post:post }, event_upVote).html(up));
					$btns.append($("<button>").attr("class", "cancelvote btn btn-default").bind("click", { post:post }, event_cancelvote).html(cancel));
					$btns.append($("<button>").attr("class", "downvote btn btn-default").bind("click", { post:post }, event_downvote).html(down));
				}
				if (post.btn_publish === "true") {
					$btns.append($("<button>").attr("class", "publish btn btn-default").bind("click", { post:post }, event_publish).text("Publish to Twitter"));
				}

				$psts.append($btns);
			});
			btns_setPost();
		});
	};

	// NOTE: Need to add server-side checks to prevent security issues.
	var event_edit = function (e) {
		$inputText.val(e.data.post.body);
		editPostId = e.data.post.id;
		btns_setEdit();
	};
	var event_upVote = function (e) {
		$.getJSON("/posts/upvote/" + e.data.post.id, refreshPosts);
	};
	var event_downvote = function (e) {
		$.getJSON("/posts/downvote/" + e.data.post.id, refreshPosts);
	};
	var event_cancelvote = function (e) {
		$.getJSON("/posts/cancelvote/" + e.data.post.id, refreshPosts);
	};
	var event_publish = function (e) {
		$.getJSON("/publish/" + e.data.post.id, refreshPosts);
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

	$inputText.on("keydown", function (e) {
		if (e.keyCode === 13) {
			if(isPost) {
				$btn_post.click();
			} else {
				$btn_update.click();
			}
		}
		originalLen = $inputText.val().length;
	});

	$inputText.on("keyup", function () {
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

	$("div .input-buttons").append($btn_update, $btn_cancelUpdate, $btn_post, $btn_revert, $btn_shorten);
	refreshPosts();
	initTweets();
};
$(document).ready(main);
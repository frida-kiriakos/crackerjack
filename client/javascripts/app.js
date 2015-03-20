// Client-side code
/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */
var main = function () {
	"use strict";
	var Post = function (textpost, id){
		this.id = id;
		this.textpost = textpost;
		this.upvotes = 0;
		this.downvotes = 0;
		this.author = "";
		this.users_upvoted = [];
		this.users_downvoted = [];
		this.upbtn = $("<button>").attr({'class':'upvote', 'id': this.id});
		this.downbtn = $("<button>").attr({'class':'downvote', 'id': this.id});
	};
	var count = 0;
	var up_btns = {};
	var down_btns = {};
	var upcount = 0;
	var downcount = 0;
	var postlist = [];
	var _maxLength = 140,
		$inputText = $('textarea.input-text').attr('maxlength',_maxLength),
		$btn_addpost = $("<button>").text("Post").attr('class', 'btn btn-default');


	$btn_addpost.on("click", function () {
		var newpost = new Post($inputText.val(), count);
		$('div .post-list').append((newpost.upbtn).append($('<span class="glyphicon glyphicon-arrow-up"></span>')));
		$('div .post-list').append((newpost.downbtn).append($('<span class="glyphicon glyphicon-arrow-down"></span>')));
		postlist.push(newpost);
		console.log(postlist);
		$('div .post-list').append('<p class="post' + count +'">' + newpost.textpost + '</p>' + '<br>');
		count++;

	});

	$(document).on('click','button.upvote', function(event){
		var btn_id = this.id;
		console.log(btn_id);
		var i = 0;
		while (i < postlist.length){
			if (postlist[i].id == btn_id){
				postlist[i].upvotes++;
				$('.post' + i).append(postlist[i].upvotes - postlist[i].downvotes);
				break;
			}
			else{
				i++;
			}
		}

	});

	$(document).on('click','button.downvote', function(event){
		var btn_id = this.id;
		var i = 0;
		console.log(postlist.length);
		while (i < postlist.length){
			if (postlist[i].id == btn_id){
				postlist[i].downvotes++;
				$('.post' + i).append(postlist[i].upvotes - postlist[i].downvotes);
				break;
			}
			else{
				i++;
			}
		}
	});
	
	

	$('div .input-buttons').append($btn_addpost);
};
$(document).ready(main);
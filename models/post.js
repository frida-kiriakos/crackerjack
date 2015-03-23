var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// posts schema
var postsSchema = new Schema({
	author: { type: Number, ref: 'User' },
	body: String,
	upvotes: Number,
	downvotes: Number,
	upvoters: [{ type: Number, ref: 'User' }],
	downvoters: [{ type: Number, ref: 'User' }],
	published: Boolean
});

module.exports = mongoose.model('Post', postsSchema);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var groupsSchema = new Schema({
	groupname: String,
	displayname: String,
});

module.exports = mongoose.model('Group', groupsSchema);

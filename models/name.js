var mongoose = require('mongoose'),
nameSchema = mongoose.Schema,
ObjectId = mongoose.Schema.Types.ObjectId;

var Name = new nameSchema({
	id:ObjectId,
	first: String,
	last: String,
	middle: String,
	prefix: String,
	suffix: String
}, {_id:false});

module.exports = mongoose.model('Name', Name);
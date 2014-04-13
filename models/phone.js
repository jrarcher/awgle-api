var mongoose = require('mongoose'),
phoneSchema = mongoose.Schema,
ObjectId = mongoose.Schema.Types.ObjectId;

var Phone = new phoneSchema({
	id:ObjectId,
	area: String,
	prefix: String,
	line: String,
	ext: String,
	country: String,
	type: String
}, {_id:false});

module.exports = mongoose.model('Phone', Phone);
var mongoose = require('mongoose'),
addressSchema = mongoose.Schema,
ObjectId = mongoose.Schema.Types.ObjectId;

var Address = new addressSchema({
	id:ObjectId,
	street1: String,
	street2: String,
	city: String,
	state: String,
	zip: String,
	country: String,
	lat: String,
	lon: String,
	type: String,
	description: String
}, {_id:false});

module.exports = mongoose.model('Address', Address);
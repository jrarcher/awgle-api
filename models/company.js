var mongoose = require('mongoose'),
companySchema = mongoose.Schema,
addy = require('../models/address.js'),
phone = require('../models/phone.js'),
ObjectId = mongoose.Schema.Types.ObjectId;

var Company = new companySchema({
	id:ObjectId,
	parent:String,
	name: String,
	type: String,
	description: String,
	created: Date,
	// aux: [],
	address:[addy.Address],
	phone:[phone.Phone]	
});

module.exports = mongoose.model('Company', Company);
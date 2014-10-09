var mongoose = require('mongoose'),
companySchema = mongoose.Schema,
addy = require('../models/address.js'),
phone = require('../models/phone.js'),
ObjectId = mongoose.Schema.Types.ObjectId,
Mixed = mongoose.Schema.Types.Mixed;

var Company = new companySchema({
	id:ObjectId,
	parent:String,
	name: String,
	type: String,
	description: String,
	created: Date,
	// aux: [],
	address:Mixed,
	phone:Mixed	
});

module.exports = mongoose.model('Company', Company);
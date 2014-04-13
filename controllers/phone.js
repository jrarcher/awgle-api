var Phone = require('../models/phone.js'),
mongoose = require('mongoose'),
async = require('async');

exports.index = function(req, res){
	Phone.find({}, function(err, docs){
		if (err){
			res.json(404);
		}
		var retDoc = {};
		retDoc["phones"] = docs;
		res.json(200, retDoc);
	});
};

exports.create = function(req, res){
	//expect an array of phone objects
	var phones = req.body.phone;

	phones.forEach(function(phone){
		var phoneId = mongoose.Types.ObjectId();
		var phones = new Phone({
			id:phoneId,
			area: phone.area,
			prefix:phone.prefix,
			line: phone.line,
			ext: phone.ext,
			type: phone.type
		});
	});

};

exports.show = function(req, res){

};

exports.destroy = function(req, res){

};

exports.update = function(req, res){
};


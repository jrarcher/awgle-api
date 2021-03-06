var Company  = require('../models/company.js'),
Phone = require('../models/phone.js'),
Address = require('../models/address.js'),
mongoose = require('mongoose'),
async = require('async');



exports.index = function(req, res){
	// res.send('show all companies');
	Company.find({},{_id:0}, function(err,docs){
		if (err){
			res.json(404, {reply:err});
		}
		var retDoc = {};
		retDoc["companies"] = docs;
		res.json(200, retDoc);
	});
};

exports.create = function(req, res){
	// res.send('create a company');
	var comd = req.body.company,
	compId = mongoose.Types.ObjectId();
	var company = {
		id:compId,
		parent: comd.parent,
		name: comd.name,
		type: comd.type,
		description: comd.description,
		created: new Date
	};

	//TODO: How to establish company unique

	var compObj = new Company(company);

	//Add Phones

	comd.phone.forEach(function(phone){

		var phoneId = mongoose.Types.ObjectId();
		var phones = new Phone({
			id:phoneId,
			area: phone.area,
			prefix:phone.prefix,
			line: phone.line,
			ext: phone.ext,
			type: phone.type
		});

		compObj.phone.push(phones);
	});

	//Add Addresses
	var addy = comd.address,
	addyId = mongoose.Types.ObjectId();
	var address = new Address({
		id:addyId,
		street1: addy.street1,
		street2: addy.street2,
		city: addy.city,
		state: addy.state,
		zip: addy.zip,
		country: addy.country,
		lat: addy.lat,
		lon: addy.lon,
		type: addy.type,
		description: addy.description
	});

	compObj.address.push(address);

	compObj.save(function(err, data){
		if (err){
			console.log(err);
			res.json(404, {reply: err})
		}
		else{
			var company = data.toObject();
			var retDoc = {};
			retDoc['company'] = company;
			res.json(200, retDoc);
		}
	});


};

exports.show = function(req, res){
	// res.send('show a company');
	var compId = req.params.id;
	Company.findOne({id:compId}, function (err, doc) {
		if (err){
			res.json(404, {reply: err});
		}else{
			var company = doc.toObject();
			var retDoc = {};
			retDoc['company'] = company;
			res.json(200, retDoc);
		}
	});
};

exports.destroy = function(req, res){
	// res.send('kill a company');
	var id = req.params.id;
	Company.remove({id: id}, function(err){
		if (err){
			var errorMsg = 'no company named ' + id;
			res.json(404);
		}
		else{
			var replyMsg = 'deleted ' + id; 
			res.json(200);
		}
	});
};

exports.update = function(req, res){
	// res.send('update a company');
	var id = req.params.id;

	var phones = req.body.company.phone;

	phones.forEach(function(phone){
		if (phone.id.length == 0){
			phone.id = mongoose.Types.ObjectId();
		}
	});

	// var savePhone = function(phone, doneCall){
	// 	console.log('ID: ' + phone.id);
	// 		if (err) return doneCall(err);
	// 		console.log('doc: ' + doc)
	// 		return doneCall(null, doc);
	// };

	Company.findOneAndUpdate({id: id}, req.body.company, function(err, doc){
		if (err) res.json(404);

		// async.map(req.body.company.phone, savePhone, function(err, results){
		// 	if (err) res.json(404);
		// 	console.log(results);
		// 	doc.phone = results;
		// 	res.json(200, doc);
		// });
		var retDoc={};
		retDoc['company'] = doc;

		res.json(200, retDoc);
	});
};
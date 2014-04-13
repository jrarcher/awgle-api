var User = require('../models/user.js'),
Address = require('../models/address.js'),
Name = require('../models/name.js'),
mongoose = require('mongoose'),
async = require('async');

exports.index = function(req, res){
	User.find({},{password:0, _id:0}, function(err, docs){
		if (err){
			res.json(404, {reply:err});
		}
		var retDoc = {};
		retDoc["users"] = docs;
		res.json(200, retDoc);
	});
};

exports.create = function(req, res){
	var names = req.body.user.name,
	addy = req.body.user.address,
	userId = mongoose.Types.ObjectId();
	// console.log('userId: ' + userId);
	var user = {
		id: userId,
		username: req.body.user.username,
		password: req.body.user.password,
		name:[],
		address:[],
		points: req.body.user.points,		
		verified: req.body.user.verified,
		// rights: req.body.rights,
		birth: Date.parse(req.body.user.birth),
		created: new Date,
		gender:req.body.user.gender 
	};

	//check for username unique, if passes save the user
	User.findOne({username: req.body.user.username}, function (err,doc) {
		if (err){
			res.json(404);
		}
		else if (doc){
			res.json(409);
		}
		else{
			var userObj = new User(user);

			//Add address
			var addyId = mongoose.Types.ObjectId();
			var address = new Address({
				id: addyId,
				street1: addy.street1,
				street2: addy.street2,
				city: addy.city,
				state: addy.state,
				zip: addy.zip,
				country: addy.country,
			});

			//Add Name
			var nameId = mongoose.Types.ObjectId();
			var name = new Name({
				id: nameId,
				first: names.first,
				last: names.last,
				middle: names.middle,
				prefix: names.prefix,
				suffix: names.suffix,
				owner:userId
			});

			userObj.address.push(address);
			userObj.name.push(name);

			//persist user object
			userObj.save(function(err, data){
				if (err){
					console.log('save user error: ' + err);
					res.json(404);
				}
				else{
					var user = data.toObject();
					delete user['password'];

					var retDoc = {};
					retDoc['user'] = user;
					res.json(200, retDoc);
				}
			});
		}
	});
};

exports.show = function(req, res){
	var id = req.params.id;
	User.findOne({id: id}, function(err,doc){
		if (err){
			console.log('No user ' + id);
			res.json(404, {reply:'Not Found'});
		}
		else{
			var user = doc.toObject();
			delete user['password'];

			var retDoc = {};
			retDoc['user'] = user;
			res.json(200, retDoc);
		}
	});
};

exports.destroy = function(req, res){
	var id = req.params.id;
	User.remove({id: id}, function(err){
		if (err){
			var errorMsg = 'no user named ' + id;
			res.json(404);
		}
		else{
			var replyMsg = 'deleted ' + id; 
			res.json(200);
		}
	});
};

exports.update = function(req, res){
	var id = req.params.id;

	User.findOneAndUpdate({id: id}, req.body.user, function(err){
		if (err){
			res.json(404);
		}
		else{
			res.json(200);
		}
	});
};
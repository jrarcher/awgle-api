var User = require('../models/user.js'),
Address = require('../models/address.js'),
Name = require('../models/name.js'),
Right = require('../models/right.js'),
mongoose = require('mongoose'),
async = require('async'),
log = require('../libs/log')(module);

exports.index = function(req, res){
	User.find({},{hashedPassword:0, salt:0, _id:0}, function(err, docs){
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
	log.info('creating user object');
	var user = {
		id: userId,
		username: req.body.user.username,
		password: req.body.user.password,
		name:[],
		address:[],
		points: req.body.user.points,		
		verified: req.body.user.verified,
		right: [],
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
log.info('creating address object');
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

log.info('creating name object');

			//Add Name
			var nameId = mongoose.Types.ObjectId();
			var name = new Name({
				id: nameId,
				first: names.first,
				last: names.last,
				middle: names.middle,
				prefix: names.prefix,
				suffix: names.suffix
			});

log.info('creating rights object');
			//Add rights
			var rightId = mongoose.Types.ObjectId();
			var rights = new Right({
				id:rightId,
				isAdmin:req.body.user.right.isAdmin
			})

			userObj.address.push(address);
			userObj.name.push(name);
			userObj.right.push(rights);

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
	User.findOne({id: id}, {_id:0, hashedPassword:0, salt:0}, function(err,doc){
		if (err){
			console.log('No user ' + id);
			res.json(404, {reply:'Not Found'});
		}
		else{
			var user = doc.toObject();
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
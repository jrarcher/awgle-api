var User = require('../models/user.js'),
	Address = require('../models/address.js'),
	Name = require('../models/name.js'),
	Right = require('../models/right.js'),
	mongoose = require('mongoose'),
	async = require('async'),
	log = require('../libs/log')(module),
	transformUser = function(doc, done) {
		// var item = {};
		// item.id = doc.id;
		// item.username = doc.username;
		// item.points = doc.points;
		// item.verified = doc.verified;
		// item.birth = doc.birth;
		// item.created = doc.created;
		// item.gender = doc.gender;

		// item.name = doc.name[0].id;
		// item.address = doc.address[0].id;
		// item.right = doc.right[0].id;

		// item.names = [doc.name];
		// item.addresses = [doc.address[0]];
		// item.rights = [doc.right[0]];

		var item = doc;

		item.name = doc.name[0].id;
		item.names.push(doc.name[0]);

		return done(null, item);
	};

exports.index = function(req, res) {
	User.find({}, {
		hashedPassword: 0,
		salt: 0,
		_id: 0,
		__v: 0
	}, function(err, docs) {
		if (err) {
			res.json(404, {
				reply: err
			});
		}
		//build as sideloaded items
		var items = docs;
		async.series({
			names: function(done) {
				async.map(items, function(doc, cb) {
					cb(null, doc.name[0]);
				}, function(err, results) {
					if (err) {
						done(err);
					}
					done(null, results);
				})
			},
			rights: function(done) {
				async.map(items, function(doc, cb) {
					cb(null, doc.right[0]);
				}, function(err, results) {
					if (err) {
						done(err);
					}
					done(null, results);
				})
			},
			addresses: function(done) {
				async.map(items, function(doc, cb) {
					cb(null, doc.address[0]);
				}, function(err, results) {
					if (err) {
						done(err);
					}
					done(null, results);
				})
			},
			users: function(done) {
				async.map(docs, function(doc, cb) {
					doc.name = doc.name[0].id;
					doc.address = doc.address[0].id;
					doc.right = doc.right[0].id;
					cb(null, doc);
				}, function(err, results) {
					if (err) {
						done(err);
					}
					done(null, results);
				})
			}
		}, function(err, results) {
			//the whole enchilada
			res.json(200, results);

		});
		// async.map(docs, transformUser,
		// 	function(err, users) {
		// 		if (err) {
		// 			res.json(404, {
		// 				reply: err
		// 			});
		// 		}
		// 		var retDoc = {};
		// 		retDoc["users"] = users;
		// 		res.json(200, retDoc);
		// 	});
	});
};

exports.create = function(req, res) {
	var names = req.body.user.name,
		addy = req.body.user.address,
		userId = mongoose.Types.ObjectId();
	// console.log('userId: ' + userId);
	log.info('creating user object');
	var user = {
		id: userId,
		username: req.body.user.username,
		password: req.body.user.password,
		name: [],
		address: [],
		points: req.body.user.points,
		verified: req.body.user.verified,
		right: [],
		birth: Date.parse(req.body.user.birth),
		created: new Date,
		gender: req.body.user.gender
	};

	//check for username unique, if passes save the user
	User.findOne({
		username: req.body.user.username
	}, function(err, doc) {
		if (err) {
			res.json(404);
		} else if (doc) {
			res.json(409);
		} else {
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
				suffix: names.suffix
			});

			//Add rights
			var rightId = mongoose.Types.ObjectId();
			var rights = new Right({
				id: rightId,
				isAdmin: req.body.user.right.isAdmin,
				canMakeAdmin: req.body.user.right.canMakeAdmin,
				canViewUser: req.body.user.right.canViewUser,
				canEditUser: req.body.user.right.canEditUser,
				canDeleteUser: req.body.user.right.canDeleteUser,
				canViewCompany: req.body.user.right.canViewCompany,
				canEditCompany: req.body.user.right.canEditCompany,
				canDeleteCompany: req.body.user.right.canDeleteCompany,
				canViewSurvey: req.body.user.right.canViewSurvey,
				canEditSurvey: req.body.user.right.canEditSurvey,
				canDeleteSurvey: req.body.user.right.canDeleteSurvey
			});

			userObj.address.push(address);
			userObj.name.push(name);
			userObj.right.push(rights);

			//persist user object
			userObj.save(function(err, data) {
				if (err) {
					console.log('save user error: ' + err);
					res.json(404);
				} else {
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

exports.show = function(req, res) {
	var id = req.params.id;
	User.findOne({
		id: id
	}, {
		_id: 0,
		hashedPassword: 0,
		salt: 0
	}, function(err, doc) {
		if (err) {
			console.log('No user ' + id);
			res.json(404, {
				reply: 'Not Found'
			});
		} else {
			var user = doc.toObject();
			var retDoc = {};
			retDoc['user'] = user;
			res.json(200, retDoc);
		}
	});
};

exports.destroy = function(req, res) {
	var id = req.params.id;
	User.remove({
		id: id
	}, function(err) {
		if (err) {
			var errorMsg = 'no user named ' + id;
			res.json(404);
		} else {
			var replyMsg = 'deleted ' + id;
			res.json(200);
		}
	});
};

exports.update = function(req, res) {
	var id = req.params.id;

	User.findOneAndUpdate({
		id: id
	}, req.body.user, function(err) {
		if (err) {
			res.json(404);
		} else {
			res.json(200);
		}
	});
};
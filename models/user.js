var mongoose = require('mongoose'),
bcrypt = require('bcrypt'),
SALT_WORK_FACTOR = 10,
userSchema = mongoose.Schema,
addy = require('../models/address.js'),
namey = require('../models/name.js'),
ObjectId = mongoose.Schema.Types.ObjectId;

var User = new userSchema({
	id: ObjectId,	
	username: String,
	password: String,
	name:[namey.Name],
	address:[addy.Address],
	points: Number,
	verified: Boolean,
	// rights:[],
	birth: Date,
	created: Date,
	gender:String      
});

User.pre('save', function(next){
	var user = this;

	// hash if modified or is new
	if (!user.isModified('password')) return next();

	//generate SALT
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
		if (err) return next(err);

		//hash pass using salt
		bcrypt.hash(user.password, salt, function(err, hash){
			if (err) return next(err);

			//override clear pass with hashed
			user.password = hash;
			next();
		});
	});
});

User.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
		if (err) return cb(err);
		cb(null, isMatch);
	});
};

module.exports = mongoose.model('User', User);
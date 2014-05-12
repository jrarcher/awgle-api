var mongoose = require('mongoose'),
crypto = require('crypto'),
userSchema = mongoose.Schema,
addy = require('../models/address.js'),
namey = require('../models/name.js'),
right = require('../models/right.js'),
ObjectId = mongoose.Schema.Types.ObjectId,
log = require('../libs/log')(module);

var User = new userSchema({
	id: ObjectId,	
	username: {
		type: String,
		unique: true,
		required : true
	},
	hashedPassword: {
		type: String,
		required: true
	},
	salt: {
		type: String,
		required:true
	},
	name:[namey.Name],
	address:[addy.Address],
	points: Number,
	verified: Boolean,
	right:[right.Right],
	birth: Date,
	created: {
		type: Date,
		default: Date.now
	},
	gender:String      
});

User.methods.encryptPassword = function(password) {
    // return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
    //more secure – 
    log.info('ecrypting password');
    return crypto.pbkdf2Sync(password, this.salt, 10000, 512);
};

User.virtual('userId')
    .get(function () {
    	log.info("trying pass");
        return this.id;
	});

User.virtual('password')
    .set(function(password) {
    	log.info('hashing password');
        this._plainPassword = password;
        // this.salt = crypto.randomBytes(32).toString('base64');
        //more secure - 
        this.salt = crypto.randomBytes(128).toString('base64');
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() { return this._plainPassword; });

User.methods.checkPassword = function(password) {
	var encPass = this.encryptPassword(password).toString();
	var hashPass = this.hashedPassword;
	var isSame = encPass === hashPass;
	log.info(typeof encPass + ':' + typeof hashPass);
	log.info('PAssword is Same: ' + isSame);
    return isSame;
};

module.exports = mongoose.model('User', User);
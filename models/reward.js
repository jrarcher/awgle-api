var mongoose = require('mongoose'),
rewardSchema = mongoose.Schema,
ObjectId = mongoose.Schema.Types.ObjectId;

var Reward = new rewardSchema({
	id:ObjectId,
	cid:String,
	type:String,
	description:String,
	expires:Date,
	image:String
}, {_id:false});

module.exports = mongoose.model('Reward', Reward);
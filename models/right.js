var mongoose = require('mongoose'),
RightSchema = mongoose.Schema,
ObjectId = mongoose.Schema.Types.ObjectId;

var Right = new RightSchema({
	id: ObjectId,
	isAdmin:{
		type: Boolean,
		default:false
	}
}, {_id: false});

module.exports = mongoose.model('Right', Right);
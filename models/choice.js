var mongoose = require('mongoose'),
ChoiceSchema = mongoose.Schema,
ObjectId = mongoose.Schema.Types.ObjectId;

var Choice = new ChoiceSchema({
	id: ObjectId,
	order: Number,
	text: String
}, {_id:false});

module.exports = mongoose.model('Choice', Choice);
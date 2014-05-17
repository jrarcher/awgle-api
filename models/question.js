var mongoose = require('mongoose'),
QuestionSchema = mongoose.Schema,
ObjectId = mongoose.Schema.Types.ObjectId;

var Question = new QuestionSchema({
	id: ObjectId,
	order: Number,
	text: String,
	type: String,
	format:String
}, {_id:false});

module.exports = mongoose.model('Question', Question);
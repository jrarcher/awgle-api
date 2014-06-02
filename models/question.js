var mongoose = require('mongoose'),
QuestionSchema = mongoose.Schema,
choice = require('../models/choice.js'),
ObjectId = mongoose.Schema.Types.ObjectId;

var Question = new QuestionSchema({
	id: ObjectId,
	order: Number,
	text: String,
	type: String,
	format:Number,
	choice:[choice.Choice]
});

module.exports = mongoose.model('Question', Question);
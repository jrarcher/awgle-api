var mongoose = require('mongoose'),
questionSchema = mongoose.Schema;

var Question = new questionSchema({
	qid: String,
	order: Number,
	text: String,
	type: String
});

module.exports = mongoose.model('Question', Question);
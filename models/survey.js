var mongoose = require('mongoose'),
surveySchema = mongoose.Schema,
question = require('../models/question.js'),
// answer = require('../models/answer.js'),
// geodata = require('../models/geodata.js'),
ObjectId = mongoose.Schema.Types.ObjectId;

var Survey = new surveySchema({
	id: ObjectId,
	cid: String,
	created: {
		type: Date,
		default: Date.now
	},
	expires: Date,
	points: Number,
	// has_reward: Boolean,
	// reward:
	// last_edited: Date,
	status: String,
	description: String,
	// scan_uid: String,
	// request: [geodata.Geodata],
	// response: [geodata.Geodata],
	question: [question.Question],
	// answer: [answer.Answer]
});

module.exports = mongoose.model('Survey', Survey);
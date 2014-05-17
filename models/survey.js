var mongoose = require('mongoose'),
surveySchema = mongoose.Schema,
question = require('../models/question.js'),
answer = require('../models/answer.js'),
ObjectId = mongoose.Schema.Types.ObjectId;

var Survey = new surveySchema({
	id: ObjectId,
	camp_id: String,
	cid: String,
	cid_sub: String,
	created: Date,
	expires: Date,
	points: Number,
	has_reward: Boolean,
	last_edited: Date,
	status: String,
	description: String,
	scan_uid: String,
	request: {
		lat: String,
		lon: String,
		time: Date
	},
	response: {
		lat: String,
		lon: String,
		time: Date
	},
	question: [question.Question],
	answer: [answer.Answer]
});

module.exports = mongoose.model('Survey', Survey);
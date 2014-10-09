var mongoose = require('mongoose'),
surveySchema = mongoose.Schema,
question = require('../models/question.js'),
// answer = require('../models/answer.js'),
// geodata = require('../models/geodata.js'),
reward = require('../models/reward.js'),
ObjectId = mongoose.Schema.Types.ObjectId;

var Survey = new surveySchema({
	id: ObjectId,
	name: String,
	cid: String,
	created: {
		type: Date,
		default: Date.now
	},
	start: {
		type: Date,
		default: Date.now
	},
	end: {
		type:Date,
		default: Date.now
	},
	points: Number,
	status: String,
	description: String,
	reward:[reward.Reward],
	question: [question.Question]
});

module.exports = mongoose.model('Survey', Survey);
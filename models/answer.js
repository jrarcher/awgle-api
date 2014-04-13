var mongoose = require('mongoose'),
answerSchema = mongoose.Schema;

var Answer = new answerSchema({
	qid: String,
	rating: String,
	comment: String
});    

module.exports = mongoose.model('Answer', Answer);
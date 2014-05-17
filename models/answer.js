var mongoose = require('mongoose'),
AnswerSchema = mongoose.Schema,
ObjectId = mongoose.Schema.Types.ObjectId;

var Answer = new AnswerSchema({
	id: ObjectId,
	rating: String,
	comment: String
});    

module.exports = mongoose.model('Answer', Answer);
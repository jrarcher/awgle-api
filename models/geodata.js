var mongoose = require('mongoose'),
GeodataSchema = mongoose.Schema,
ObjectId = mongoose.Schema.Types.ObjectId;

var Geodata = new GeodataSchema({
	id: ObjectId,
	lat:String,
	lon:String,
	time:Date,
	type:Number
}, {_id:false});    

module.exports = mongoose.model('Geodata', Geodata);
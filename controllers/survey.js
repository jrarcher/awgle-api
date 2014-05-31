var Survey  = require('../models/survey.js'),
Question = require('../models/question.js'),
Choice = require('../models/choice.js'),
mongoose = require('mongoose'),
aync = require('async'),
log = require('../libs/log')(module);

exports.index = function(req, res){
	// res.send('show all surveys');
	Survey.find({}, {_id:0}, function(err,docs){
		if (err){
			res.json(404,{reply:err});
		}
		var retDoc = {};
		retDoc["surveys"] = docs;
		res.json(200, retDoc);
	});
};

exports.create = function(req, res){
	// res.send('create a survey');
	var _survey = req.body.survey,
	surveyId = mongoose.Types.ObjectId();
	log.info('createing survey object');
	var survey = {
		id:surveyId,
		cid:_survey.cid,
		start:_survey.start,
		end:_survey.end,
		points:_survey.points,
		status:_survey.status,
		description:_survey.description,
		question:[],
		reward:[]
	};

	var surveyObj = new Survey(survey);

	//Add questions
	survey.question.forEach(function(question){
		var questionId = mongoose.Types.ObjectId();
		var _question = new Question({
			id:questionId,
			order:question.order,
			text:question.text,
			type:question.type,
			format:question.format,
			choice:[]
		});
		if (question.format === 1){
			question.choice.forEach(function(choice){
				var choiceId = mongoose.Types.ObjectId();
				var _choice = new Choice({
					id:choiceId,
					order:choice.order,
					text:choice.text
				});
				_question.choice.push(_choice);
			})
		}
		survey.question.push(_question);
	});

	surveyObj.save(function(err,data){
		if (err){
			res.json(404, {reply:err});
		}

		var survey = data.toObject();
		var retDoc = {};
		retDoc['survey'] = survey;
		res.json(200, retDoc);
	});
};

exports.show = function(req, res){
	// res.send('show a survey');
	var surveyId = req.params.id;
	Survey.findOne({id:surveyId}, function(err, doc){
		if (err){
			res.json(404, {reply:err});
		}

		var survey = data.toObject();
		var retDoc = {};
		retDoc['survey'] = survey;
		res.json(200, retDoc);
	});
};

exports.destroy = function(req, res){
	// res.send('kill a survey');
	var id = req.params.id;
	Survey.remove({id: id}, function(err){
		if (err){
			var errorMsg = 'no survey with id: ' + id;
			res.json(404, {reply:errorMsg});
		}
		else{
			var replyMsg = 'deleted ' + id; 
			res.json(200);
		}
	});
};

exports.update = function(req, res){
	res.send('update a survey');
};
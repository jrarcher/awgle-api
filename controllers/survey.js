var Survey  = require('../models/survey.js'),
mongoose = require('mongoose');

exports.index = function(req, res){
	res.send('show all surveys');
};

exports.create = function(req, res){
	res.send('create a survey');
};

exports.show = function(req, res){
	res.send('show a survey');
};

exports.destroy = function(req, res){
	res.send('kill a survey');
};

exports.update = function(req, res){
	res.send('update a survey');
};

/**
 * Module dependencies.
 */

var express = require('express'),
routes = require('./routes'),
// user = require('./controllers/user'),
map = require('./controllers/maproutecontroller'),
http = require('http'),
path = require('path'),
mongoose = require('mongoose');

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(allowCrossDomain);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

mongoose.connect('mongodb://127.0.0.1/AwgleDb');
mongoose.connection.on('open', function(){
	console.log('Connected to Mongoose');
});

// app.get('/', routes.index);
// app.get('/users', user.list);
var prefixes = ['user', 'company' ,'survey', 'phone', 'question', 'answer'];

prefixes.forEach(function(prefix){
	map.mapRoute(app, prefix);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

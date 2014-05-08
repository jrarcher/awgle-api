var express = require('express'),
routes = require('./routes'),
// user = require('./controllers/user'),
map = require('./controllers/maproutecontroller'),
http = require('http'),
path = require('path'),
mongoose = require('mongoose'),
passport = require('passport'),
log = require('./libs/log')(module),
config = require('./libs/config'),
oauth2 = require('./libs/oauth2'),
ClientModel = require('./models/client.js');

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

app.use(allowCrossDomain);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.json());
app.use(passport.initialize());
app.use(express.methodOverride());
app.use(app.router);

// app.use(express.static(path.join(__dirname, 'public')));

require('./libs/auth');

// app.use(function(req, res, next){
//     res.status(404);
//     log.debug('Not found URL: %s',req.url);
//     res.send({ error: 'Not found' });
//     return;
// });

// app.use(function(err, req, res, next){
//     res.status(err.status || 500);
//     log.error('Internal error(%d): %s',res.statusCode,err.message);
//     res.send({ error: err.message });
//     return;
// });

app.post('/oauth/token', oauth2.token);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

mongoose.connect(config.get('mongoose:uri'));
var db = mongoose.connection;

db.on('error', function (err) {
    log.error('connection error:', err.message);
});

db.once('open', function callback () {
    log.info("Connected to DB!");
    ClientModel.remove({}, function(err) {
        var client = new ClientModel({ 
            name: "Awgle API", 
            clientId: "webApp1", 
            clientSecret:"2pennie$" 
        });
        client.save(function(err, client) {
            if(err) return log.error(err);
            else log.info("New client - %s:%s",client.clientId,client.clientSecret);
        });
    });
});

// app.get('/', routes.index);
// app.get('/users', user.list);
var prefixes = ['user', 'company' ,'survey', 'phone', 'question', 'answer'];

prefixes.forEach(function(prefix){
	map.mapRoute(app, prefix);
});

http.createServer(app).listen(config.get('port'), function(){
    log.info('Express server listening on port ' + config.get('port'));
});
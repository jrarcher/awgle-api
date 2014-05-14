var oauth2orize         = require('oauth2orize');
var passport            = require('passport');
var crypto              = require('crypto');
var config              = require('./config');
var UserModel               = require('../models/user.js');
var ClientModel             = require('../models/client.js');
var AccessTokenModel        = require('../models/accesstoken.js');
var RefreshTokenModel       = require('../models/refreshtoken.js');
var log = require('../libs/log')(module);

// create OAuth 2.0 server
var server = oauth2orize.createServer();

// Exchange username & password for access token.
server.exchange(oauth2orize.exchange.password(function(client, username, password, scope, done) {

    log.info('Got here');

    UserModel.findOne({username: username}, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (!user.checkPassword(password)) { return done(null, false); }

        // log.info('userID: ' +user.userId);

        

        RefreshTokenModel.remove({ userId: user.userId, clientId: client.clientId }, function (err) {
            if (err) return done(err);
        });
        AccessTokenModel.remove({ userId: user.userId, clientId: client.clientId }, function (err) {
            if (err) return done(err);
        });

        var tokenValue = crypto.randomBytes(32).toString('base64');
        var refreshTokenValue = crypto.randomBytes(32).toString('base64');

        var token = new AccessTokenModel({ 
            token: tokenValue, 
            clientId: client.clientId, 
            userId: user.userId 
        });
        var refreshToken = new RefreshTokenModel({ 
            token: refreshTokenValue, 
            clientId: client.clientId, 
            userId: user.userId 
        });

        refreshToken.save(function (err) {
            if (err) { return done(err); }
        });

        var info = { scope: '*' };

        var _user = user.toObject();
        delete _user.hashedPassword;
        delete _user._id;
        delete _user.salt;

        _user = JSON.stringify(_user);

        token.save(function (err, token) {
            if (err) { return done(err); }
            done(null, tokenValue, refreshTokenValue, 
                { 
                    'expires_in': config.get('security:tokenLife'),
                    'user' : _user 
                });
        });
    });
}));

// Exchange refreshToken for access token.
server.exchange(oauth2orize.exchange.refreshToken(function(client, refreshToken, scope, done) {
    RefreshTokenModel.findOne({ token: refreshToken }, function(err, token) {
        if (err) { return done(err); }
        if (!token) { return done(null, false); }
        if (!token) { return done(null, false); }

        UserModel.findById(token.userId, function(err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }

            RefreshTokenModel.remove({ 
                userId: user.userId, 
                clientId: client.clientId 
            }, function (err) {
                if (err) return done(err);
            });
            AccessTokenModel.remove({ 
                userId: user.userId, 
                clientId: client.clientId 
            }, function (err) {
                if (err) return done(err);
            });

            var tokenValue = crypto.randomBytes(32).toString('base64');
            var refreshTokenValue = crypto.randomBytes(32).toString('base64');

            var token = new AccessTokenModel({ 
                token: tokenValue, 
                clientId: client.clientId, 
                userId: user.userId 
            });
            var refreshToken = new RefreshTokenModel({ 
                token: refreshTokenValue, 
                clientId: client.clientId, 
                userId: user.userId 
            });

            refreshToken.save(function (err) {
                if (err) { return done(err); }
            });
            var info = { scope: '*' };

            var _user = user.toObject();
            delete _user.hashedPassword;
            delete _user._id;
            delete _user.salt;

            _user = JSON.stringify(_user);

            token.save(function (err, token) {
                if (err) { return done(err); }
                done(null, tokenValue, refreshTokenValue, 
                    { 
                    'expires_in': config.get('security:tokenLife'),
                    'user' : _user 
                    });
            });
        });
    });
}));

// token endpoint
exports.token = [
    passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
    server.token(),
    server.errorHandler()
]
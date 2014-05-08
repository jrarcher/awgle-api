var log = require('./libs/log')(module);
var mongoose = require('mongoose');
var UserModel = require('./models/user.js');
var ClientModel = require('./models/client.js');
var AccessTokenModel = require('./models/accesstoken.js');
var RefreshTokenModel = require('./models/refreshtoken.js');
// var faker = require('faker');

UserModel.remove({}, function(err) {
    var user = new UserModel({ username: "rleinen", password: "abc123" });
    user.save(function(err, user) {
        if(err) return log.error(err);
        else log.info("New user - %s:%s",user.username,user.password);
    });

    // for(i=0; i<4; i++) {
    //     var user = new UserModel({ 
    //         username: faker.random.first_name().toLowerCase(), 
    //         password: faker.Lorem.words(1)[0] 
    //     });
    //     user.save(function(err, user) {
    //         if(err) return log.error(err);
    //         else log.info("New user - %s:%s",user.username,user.password);
    //     });
    // }
});

// ClientModel.remove({}, function(err) {
//     var client = new ClientModel({ 
//         name: "Awgle API", 
//         clientId: "webApp1", 
//         clientSecret:"2pennie$" 
//     });
//     client.save(function(err, client) {
//         if(err) return log.error(err);
//         else log.info("New client - %s:%s",client.clientId,client.clientSecret);
//     });
// });
// AccessTokenModel.remove({}, function (err) {
//     if (err) return log.error(err);
// });
// RefreshTokenModel.remove({}, function (err) {
//     if (err) return log.error(err);
// });

setTimeout(function() {
    mongoose.disconnect();
}, 3000);
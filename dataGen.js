var log = require('./libs/log')(module);
var mongoose = require('mongoose');
var UserModel = require('./models/user.js'),
    Address = require('./models/address.js'),
    Name = require('./models/name.js'),
    Right = require('./models/right.js');
var ClientModel = require('./models/client.js');
var AccessTokenModel = require('./models/accesstoken.js');
var RefreshTokenModel = require('./models/refreshtoken.js');
var config = require('./libs/config');
// var faker = require('faker'); 

mongoose.connect(config.get('mongoose:uri'));
var db = mongoose.connection;

db.on('error', function(err) {
    log.error('connection error:', err.message);
});

UserModel.remove({}, function(err) {
    var user = new UserModel({
        id: mongoose.Types.ObjectId(),
        username: "pll@pll.com",
        password: "foo",
        birth: Date.parse("1/1/1985"),
        created: new Date,
        gender: "m",
        points: 0,
        verified: false,
        name: [],
        address: [],
        right: []
    });

    var nameId = mongoose.Types.ObjectId();
    var name = new Name({
        id: nameId,
        first: "Adam",
        last: "Alpha",
        middle: "Ace",
        prefix: "Mr.",
        suffix: "Esq."
    });
    var addyId = mongoose.Types.ObjectId();
    var address = new Address({
        id: addyId,
        street1: "1 main",
        street2: "apt. 1",
        city: "austin",
        state: "tx",
        zip: "78701",
        country: "usa"
    });

    var rightId = mongoose.Types.ObjectId();
    var right = new Right({
        id: rightId,
        isAdmin: true
    });

    user.address.push(address);
    user.name.push(name);
    user.right.push(right);

    user.save(function(err, user) {
        if (err) return log.error(err);
        else log.info("New user - %s:%s", user.username, user.password);
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
var mongoose = require('mongoose'),
refreshTokenSchema = mongoose.Schema;


var RefreshToken = new refreshTokenSchema({
    userId: {
        type: String,
        required: true
    },
    clientId: {
        type: String,
        required: true
    },
    token: {
        type: String,
        unique: true,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('RefreshToken', RefreshToken);
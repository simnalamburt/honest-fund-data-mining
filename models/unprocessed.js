var mongoose = require('mongoose');

var upSchema = mongoose.Schema({
    ip: { type: String },
    email: { type: String },
    url: { type: String },
    timestamp: { type: Number }
});

module.exports = mongoose.model('Unprocessed', upSchema);

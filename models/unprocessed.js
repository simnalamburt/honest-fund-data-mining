var mongoose = require('mongoose');

var upSchema = mongoose.Schema({
    ip: String,
    email: String,
    location: {
        latitude: Number,
        longitude: Number
    },
    url: String,
    timestamp: Number,
    timestamp_exit: Number,
    keystroke: {
        time: [Number],
        key: [Number],
        id: [String]
    },
    scroll: {
        time: [Number],
        pos: [Number]
    },
    highlight: [String],
    click: {
        time: [Number],
        id: [String]
    },
    window: {
        width: Number,
        height: Number
    },
    monitor: {
        width: Number,
        height: Number
    },
    user_agent: String,
    platform: String,
    os: String,
    browser: String,
    referer: String,
    contact: String
});

module.exports = mongoose.model('Unprocessed', upSchema);

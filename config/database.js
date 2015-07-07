var secret = require('./secret.js');
var URL = secret.dbUrl;

module.exports = function(mongoose){
    mongoose.connect(URL);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function(){
        console.log('Connected to DB');
    });
};

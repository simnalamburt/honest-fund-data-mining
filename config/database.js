var URL = 'mongodb://localhost/myapp'

module.exports = function(mongoose){
    mongoose.connect(URL);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function(){
        console.log('Connected to DB');
    });
};

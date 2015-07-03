var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_ROUNDS = 8;

var userSchema = mongoose.Schema({
    email: {type: String, require: true, unique: true},
    password: {type: String, required: true},
});

userSchema.pre('save', function(next){
    var user = this;
    if(!user.isModified('password')) return next();
    bcrypt.hash(user.password, SALT_ROUNDS, function(err, hash){
        if(err) return next(err);
        user.password = hash;
        next();
    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb){
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', userSchema);

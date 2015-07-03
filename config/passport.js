var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

module.exports = function(passport){
    passport.serializeUser(function(user, done){
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user){
            done(err, user);
        });
    });

    passport.use('local-register', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, function(email, password, done){
        User.findOne({ email: email }, function(err, user){
            if(err){
                console.error('local-register: find query error');
                return done(err, { message: 'Server error' });
            }
            if(user){
                console.log('local-register: user already exists ' + email);
                return done(null, false, { message: 'Email already exists: ' + email });
            }
            var user = new User({ email: email, password: password });
            user.save(function(err){
                if(err){
                    console.error('local-register: save query error');
                    return done(err, { message: 'Server error'});
                }
                console.log('local-register: register success ' + email);
                return done(null, user, { message: 'Register success!' });
            });
        });
    }));

    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, function(email, password, done){
        User.findOne({ email: email }, function(err, user){
            if(err){
                console.error('local-login: find query error');
                return done(err, { message: 'Server error' });
            }
            if(!user){
                console.log('local-login: unknown user ' + email);
                return done(null, false, { message: 'Unknown user: ' + email });
            }
            user.comparePassword(password, function(err, isMatch){
                if(err){
                    console.error('local-login: query error');
                    return done(err, { message: 'Server error' });
                }
                if(!isMatch){
                    console.log('local-login: wrong password ' + email);
                    return done(null, false, { message: 'Invalid password' });
                }
                console.log('local-login: login success ' + email);
                return done(null, user, { message: 'Login success!' });
            });
        });
    }));
};

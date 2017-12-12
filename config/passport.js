var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done){ // tell passport how to serialize the user
	done(null, user.id); // serialize it by the id or null if there is no id
});

passport.deserializeUser(function(id, done){ // tell passport how to deserialize the user
	User.findById(id, function(err, user){
		done(err, user); // return error or user if done successfully
	});
});

passport.use('local.signup', new LocalStrategy({
	usernameField: 'email', //refers to HTML id's
	passwordField: 'password',
	passReqToCallback: true
}, function(req, email, password, done){
	// Validate the input parameters
	req.checkBody('email', 'Invalid Email').notEmpty().isEmail();
	req.checkBody('password', 'Invalid Password').notEmpty().isLength({min: 4});
	var errors = req.validationErrors(); // Runs all validators and stores the gathered errors
	if(errors){
		var messages = []
		errors.forEach(function(error){
			messages.push(error.msg);
		});
		// Didn't throw error, but not successful signaled with null, false (insteaqd of user like below)
		return done(null, false, req.flash('error', messages));
	}
	User.findOne({'email': email}, function(err, user){
		if(err){
			return done(err);
		}
		if(user){
			// No err (null passed), If a user is found, someone already used the email! (false passed)
			return done(null, false, {message: 'Email is already in use'});
		}
		// No user or errors, create a new user
		var newUser = new User();
		newUser.email = email;
		newUser.password = newUser.encryptPassword(password);
		// Insert it into the db
		newUser.save(function(err, result){
			if(err){
				return done(err);
			}
			return done(null, newUser); // returns no error (null) and the new user
		}); 
	});
}));

passport.use('local.signin', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
}, function(req, email, password, done){
	// Validate the input parameters
	req.checkBody('email', 'Invalid Email').notEmpty().isEmail();
	req.checkBody('password', 'Invalid Password').notEmpty();
	var errors = req.validationErrors();
	if(errors){
		var messages = [];
		errors.forEach(function(error){
			messages.push(error.msg);
		});
		return done(null, false, req.flash('error', messages));
	}
	// Query to find an existing user
	User.findOne({'email': email}, function(err, user){
		if(err){
			return done(err);
		}
		if(!user){
			// No user found!
			return done(null, false, {message: 'No user found. Please sign up.'});
		}
		if(!user.validPassword(password)){
			// Invalid password, don't return the user in the db
			return done(null, false, {message: 'Wrong Password'});
		}
		// Found user, and valid password, return the user
		return done(null, user);
	});
}));
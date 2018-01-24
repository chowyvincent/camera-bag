var passport = require('passport');
var User = require('../models/user');
var GearList = require('../models/gearlist');
var GearListItem = require('../models/gearlistitem');
var Bag = require('../models/bag');
var LocalStrategy = require('passport-local').Strategy;
// var CustomStrategy = require('passport-custom').Strategy;

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
	req.checkBody('password', 'Invalid Password. Must 4 characters or more.').notEmpty().isLength({min: 4});
	req.checkBody('passwordTwo', 'Passwords do not match').notEmpty().equals(req.body.password);
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
		User.findOne({'username': req.body.username}, function(err, username){
			if(err){
				return done(err);
			}
			if(username){
				return done(null, false, {message: 'Username is already in use'});
			}
			// No user or errors, create a new user
			var newUser = new User();
			newUser.username = req.body.username;
			newUser.email = email;
			newUser.password = newUser.encryptPassword(password);
			// Save user into the session
			req.session.userId = newUser._id;
			req.session.username = newUser.username;
			// Insert it into the db
			newUser.save(function(err, result){
				if(err){
					return done(err);
				}
				return done(null, newUser); // returns no error (null) and the new user
			}); 
		});
		// // No user or errors, create a new user
		// var newUser = new User();
		// newUser.email = email;
		// newUser.password = newUser.encryptPassword(password);
		// // Insert it into the db
		// newUser.save(function(err, result){
		// 	if(err){
		// 		return done(err);
		// 	}
		// 	return done(null, newUser); // returns no error (null) and the new user
		// }); 
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
		req.session.userId = user._id;
		req.session.username = user.username;
		return done(null, user);
	});
}));

// passport.use('basic', new CustomStrategy(function(req, done){
// 	// req.session.gearlist stores all the information to be added into the bag
// 	// req.session.userId stores the user
// 	// Need to get the gearlist name, possibly req.body.fieldName??
// 	req.checkBody('bagTitle', 'Must Add Bag Title').notEmpty();
// 	var title = req.body.bagTitle;
// 	var description = req.body.description;
// 	var errors = req.validationErrors();
// 	if(errors){
// 		var messages = [];
// 		errors.forEach(function(error){
// 			messages.push(error.msg);
// 		});
// 		return done(errors, false, req.flash('error', messages));
// 	}
// 	// return done(null, new Bag());
// 	Bag.findOne({'title': title}, function(err, bag){
// 		if(err){
// 			return done(err);
// 		}
// 		if(bag){
// 			// No err (null passed), If a bag is found, bag name is already used(false passed)
// 			return done(null, false, {message: 'Bag name is already in use.'});
// 		}
// 		// No bag or errors, create a new bag
// 		var newBag = new Bag();
// 		newBag.userId = req.session.userId;
// 		newBag.title = title;
// 		newBag.totalQty = req.session.gearlist.totalQty;
// 		newBag.totalPrice = req.session.gearlist.totalPrice;
// 		newBag.description = description
// 		var newBagProducts = [];
// 		var gearlistobj = new GearList(req.session.gearlist);
// 		var products = gearlistobj.generateArray();
// 		products.forEach(function(product){
// 			var newGearItem = new GearListItem();
// 			newGearItem.productId = product.id;
// 			newGearItem.qty = product.qty;
// 			newGearItem.description = "Example description";
// 			newBagProducts.push(newGearItem);
// 		});
// 		newBag.products = newBagProducts;


// 		// Insert it into the db
// 		newBag.save(function(err, result){
// 			if(err){
// 				return done(err);
// 			}
// 			return done(null, newBag); // returns no error (null) and the new bag
// 		}); 
// 	});
// }));
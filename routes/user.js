var express = require('express');
var router = express.Router();

// Added below
var csrf = require('csurf');
var passport = require('passport');
var GearList = require('../models/gearlist');
var GearListItem = require('../models/gearlistitem');
var Bag = require('../models/bag');
var Product = require('../models/product');
var User = require('../models/user');

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/error', function(req, res, next){
	res.render('user/usererror');
});

router.get('/gearlist', isLoggedIn, function(req, res, next){
	// If a created gearlist exists
	if(!req.session.gearlist){
		return res.render('user/gearlist', {products: null}); // Signals no items in the gearlist
	}
	var messages = req.flash('error');
	var gearlist = new GearList(req.session.gearlist);
	// Pass in all of the products and the total price
	res.render('user/gearlist', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0,
		products: gearlist.generateArray(), totalPrice: gearlist.totalPrice});
});

router.post('/gearlist', isLoggedIn, function(req, res, next){
	var title = req.body.bagTitle;
	var description = req.body.description;
	Bag.findOne({'title': title}, function(err, bag){
		if(err){
			throw err;
		}
		if(bag){
			// No err (null passed), If a bag is found, bag name is already used(false passed)
			var messages = ['Bag name already taken.'];
			req.flash('error', messages);
			// var gearlist = new GearList(req.session.gearlist);
			return res.redirect('/user/gearlist');
		}
		// No bag or errors, create a new bag
		var newBag = new Bag();
		newBag.userId = req.session.userId;
		newBag.title = title;
		newBag.totalQty = req.session.gearlist.totalQty;
		newBag.totalPrice = req.session.gearlist.totalPrice;
		newBag.description = description;
		var newBagProducts = [];
		var gearlistobj = new GearList(req.session.gearlist);
		var products = gearlistobj.generateArray();
		products.forEach(function(product){
			var newGearItem = new GearListItem();
			newGearItem.productId = product.id;
			newGearItem.qty = product.qty;
			newGearItem.description = product.itemDescription;
			newBagProducts.push(newGearItem);
		});
		newBag.products = newBagProducts;

		// Insert it into the db
		newBag.save(function(err, result){
			if(err){
				res.render('user/usererror');
			}
		});
		req.session.gearlist = null; // Reset the session gearlist to empty
		res.redirect('/user/profile'); 
	});
});


router.get('/profile', isLoggedIn, function(req, res, next){
	var username = "";
	User.findById(req.session.userId, function(err, user){
		if(err){
			throw err;
		}
		username = user.username;
	});
	Bag.find({'userId': req.session.userId}, function(err, bags){
		var results = [];
		// var images = [];
		var rowSize = 3;
		for(var i = 0; i < bags.length; i += rowSize){
			// var innerImages = [];
			// var bagSlice = bags.slice(i, i+ rowSize);
			// for(var j = 0; j < bagSlice.length; j += 1){
			// 	//Get the first productID in the bag
			// 	var productId = bagSlice[j].products[0].productId;
			// 	console.log(productId);
			// 	var imageUrl = "";
			// 	Product.findById(productId, function(err, product){
			// 		innerImages.push(product.imageUrl);
			// 	});
			// }
			// images.push(innerImages);
			results.push(bags.slice(i, i + rowSize));
		}
		res.render('user/profile', {title: 'User Profile', username: username, results: results});
	});
});

router.get('/logout', function(req, res, next){
	req.logout(); //provided by passport
	req.session.destroy(); // Destroy the session when logging out, good or bad?
	// req.session.gearlist = null; // Clear gearlist count when logging out, good or bad?
	res.redirect('/');
});

router.get('/signup', notLoggedIn, function(req, res, next){
	var messages = req.flash('error');
	res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signup', notLoggedIn, passport.authenticate('local.signup', {
	successRedirect: '/user/profile',
	failureRedirect: '/user/signup',
	failureFlash: true
}));

router.get('/signin', notLoggedIn, function(req, res, next){
	var messages = req.flash('error');
	res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signin', notLoggedIn, passport.authenticate('local.signin', {
	successRedirect: '/user/profile',
	failureRedirect: '/user/signin',
	failureFlash: true
}));

module.exports = router;

// Route protection functions
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/user/signin');
};

function notLoggedIn(req, res, next){
	if(!req.isAuthenticated()){
		return next();
	}
	res.redirect('/');
};
var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var User = require('../models/user');
var Bag = require('../models/bag');
var GearList = require('../models/gearlist');

/* GET home page. */
router.get('/', function(req, res, next) {
	Product.find(function(err, docs){
		var productRow = [];
		var rowSize = 3;
		for(var i = 0; i < docs.length; i += rowSize){
			productRow.push(docs.slice(i, i + rowSize));
		}
		res.render('bag/index', {title: 'Camera Bag', products: productRow})
	});
});

router.get('/search', function(req, res, next){
	User.find({"username": {"$regex": req.query.username, "$options": "i"}}, function(err, users){
		if(err){
			throw err;
		}
		res.render("bag/searchresults", {users: users});
	});
});

router.get('/add-to-gearlist/:id', function(req, res, next){
	var productId = req.params.id;
	var oldGearList = req.session.gearlist;
	if(!oldGearList){
		oldGearList = {};
	}
	var gearlist = new GearList(oldGearList);
	// Find the product in the db
	Product.findById(productId, function(err, product){
		if(err){
			return res.redirect('/');
		}
		gearlist.add(product, product.id);
		req.session.gearlist = gearlist; // Store the gearlist in the session
		console.log(req.session.gearlist);
		res.redirect('/');
	});
});

router.get('/profile/:username', function(req, res, next){
	console.log(req.params.username);
	User.findOne({'username': req.params.username}, function(err, user){
		if(err){
			throw err;
		}
		console.log(user.username);
		Bag.find({'userId': user._id}, function(err, bags){
			if(err){
				throw err;
			}
			var results = [];
			var rowSize = 3;
			for(var i = 0; i < bags.length; i += rowSize){
				results.push(bags.slice(i, i + rowSize));
			}
			res.render('bag/searchprofile', {title: 'User Profile', username: req.params.username, results: results});
		});
	});

});

router.get('/clear-gearlist', function(req, res, next){
	req.session.gearlist = null; // Destroy the session when logging out, good or bad?
	res.redirect('/');
});
module.exports = router;

var express = require('express');
var router = express.Router();
var Product = require('../models/product');
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

router.get('/clear-gearlist', function(req, res, next){
	req.session.gearlist = null; // Destroy the session when logging out, good or bad?
	res.redirect('/');
});
module.exports = router;

var Product = require('../models/product'); // import the Product model
var mongoose = require('mongoose');
var fs = require('fs');
mongoose.connect('localhost:27017/camerabag');

var bodyData = JSON.parse(fs.readFileSync('bh_bodies.json', 'utf8'));
var lensData = JSON.parse(fs.readFileSync('bh_lenses.json', 'utf8'));
var lensImageData = JSON.parse(fs.readFileSync('lensImages.json', 'utf8'));
var bodyImageData = JSON.parse(fs.readFileSync('bodyImages.json', 'utf8'));

// // Make mulitple products
// var products = [
// 	new Product({
// 		itemName: "Nikon - D850 DSLR Camera (Body Only) - Black",
// 		imageUrl: "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6084/6084300_sa.jpg;maxHeight=145;maxWidth=222",
// 		price: 3299.99
// 	}),
// 	new Product({
// 		itemName: "Nikon - D7200 DSLR Camera (Body Only) - Black",
// 		imageUrl: "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/4440/4440011_sa.jpg;maxHeight=145;maxWidth=222",
// 		price: 999.99
// 	}),
// 	new Product({
// 		itemName: "Nikon - D750 DSLR Camera (Body Only) - Black",
// 		imageUrl: "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/8753/8753712_sa.jpg;maxHeight=145;maxWidth=222",
// 		price: 1799.99
// 	}),
// 	new Product({
// 		itemName: "Nikon - D7500 DSLR Camera (Body Only)",
// 		imageUrl: "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/5852/5852906_sa.jpg;maxHeight=145;maxWidth=222",
// 		price: 1249.99
// 	}),
// 	new Product({
// 		itemName: "Nikon - D500 DSLR Camera (Body Only) - Black",
// 		imageUrl: "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/4870/4870600_sa.jpg;maxHeight=145;maxWidth=222",
// 		price: 1899.99
// 	}),
// 	new Product({
// 		itemName: "Nikon - D810 DSLR Camera (Body Only) - Black",
// 		imageUrl: "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/7521/7521025_sa.jpg;maxHeight=145;maxWidth=222",
// 		price: 2799.99
// 	})
// ];

// Process Bodies
var products = [];
for(var i = 0; i < bodyData.length; i++){
	var product = new Product(bodyData[i]);
	product.imageUrl = bodyImageData[product.itemName]
	if(bodyData[i].itemName.includes("mm")){
		product.itemType = "lens";
	}else{
		product.itemType = "body";
	}
	products.push(product);
}

// Process Lenses
for(var i = 0; i < lensData.length; i++){
	var product = new Product(lensData[i]);
	product.imageUrl = lensImageData[product.itemName]
	if(lensData[i].itemName.includes("mm")){
		product.itemType = "lens";
	}else{
		product.itemType = "body";
	}
	products.push(product);
}


// Used to signal when the function is done for the callback to disconnect mongoose for asycnhronous-ity of nodejs
var done = 0;
// Store products in the database
for(var i = 0; i < products.length; i++){
	products[i].save(function(err, result){
		done++;
		if(done == products.length){
			exit();
		}
	});
}
function exit(){
	mongoose.disconnect();	
}
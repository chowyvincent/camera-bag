var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.SchemaTypes.ObjectId;
var GearListItem = require('../models/gearlistitem');

// Bag model stores gear lists

var schema = new Schema({
	userId: {type: String, required: true},
	products: [{
		productId: {type: String, required: true},
		qty: {type:Number, required: true},
		description: {type: String, required: false}
	}],
	title: {type: String, required: true},
	totalQty: {type: Number, required: true},
	totalPrice: {type: Number, required: true},
	description: {type: String, required: false}
});

module.exports = mongoose.model('Bag', schema);
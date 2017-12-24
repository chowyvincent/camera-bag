var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
	productId: {type: String, required: true},
	qty: {type:Number, required: true},
	description: {type: String, required: false}
});

module.exports = mongoose.model('GearListItem', schema);
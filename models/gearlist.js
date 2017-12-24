// GearList constructor, make it available to all imports
module.exports = function GearList(oldGearList){
	// Fetch all the old data from oldGearList and create a new bag when an item is added
	// If the value is undefined, it will use the default value
	this.items = oldGearList.items || {};
	this.totalQty = oldGearList.totalQty || 0;
	this.totalPrice = oldGearList.totalPrice || 0;

	this.add = function(item, id, itemDescription){
		var storedItem = this.items[id]
		// If adding a new item, create a new product
		if(!storedItem){
			storedItem = this.items[id] = {id: id, qty: 0, item: item, price: 0};
			// this.items[id] = {qty:0, item: item, price: 0};
		}
		// Regardless of new or old item
		storedItem.qty++;
		storedItem.price = storedItem.item.price * storedItem.qty;
		this.totalQty++;
		this.totalPrice += storedItem.item.price;
	};

	// Helper function to return the list of items in the bag
	this.generateArray = function(){
		var arr = [];
		for(var id in this.items){
			arr.push(this.items[id]);
		}
		return arr;
	};

};
'use strict';

function Collection(filterName, filterArguments){
	this.filterName = filterName || "FilterGetAll"; // The default collection is everything in the repository.
	this.filterArguments = filterArguments || []; // The default filter function doesn't require any arguments.
	this.items = []; // No items until the collection is updated.
	RepositoryItem.call(this);
}
Collection.prototype = Object.create(RepositoryItem.prototype);
Collection.constructor = Collection;
Collection.prototype.update = function(){
	this.items = Repository.everything().filter(this[this.filterName].apply(null, this.filterArguments)); // Filter through every item in the repository to get our items
	for(var i = 0; i < this.items.length; ++i){
		this.items[i].prototype = RepositoryItem.prototype;
	}
};
Collection.prototype.toJSON = function(){ // We need to make sure that the items array isn't saved to the repository because this would cause an exponential increase in size.
	var temp = {};
	for (var key in this){
		if(this.hasOwnProperty(key)) temp[key] = this[key];
	}
	delete temp.items;
	return temp;
};


/**
 * These are filter functions. They allow the collection to choose what kinds of items are in it.
 * Some are a simple as a list of IDs but others can be as complex as a function that analyzes the
 * attributes of the items.  This could be used to collect all of the items in the repository that
 * have a certain type or have a certain attribute value.
 *
 * All of the returned functions should be boolean because they are used with Array.prototype.filter()
 *
 */
Collection.prototype.FilterGetAll = function(){ // Return a filter function that keeps all items
	return (function(item, index, array){
		return true;
	}.bind(null)); // There should be no usage of this in the filter function.  Instead, all variables needed should be bound to the returned function.
};
Collection.prototype.FilterGetListedIDs = function(keepThese){ // Return a filter function that keeps only the items with ids that are in the lists
	return (function(keepThese, item, index, array){
		return keepThese.includes(item.id);
	}.bind(null, keepThese)); // There should be no usage of this in the filter function.  Instead, all variables needed should be bound like include here.
};
Collection.prototype.FilterGetWhereTypeIs = function(type){ // Return a filter function that keeps all items with a certain type
	return (function(type, item, index, array){
		return (item.type == type);
	}.bind(null, type));
};

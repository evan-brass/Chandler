'use strict';

function Collection(filterName, filterArguments){
	RepositoryItem.call(this);

	this.on || Eventable(Collection); // If we haven't made the Collection class eventable then we do that now

	if(typeManager.isRegistered('Collection')){
		typeManager.registerType("Collection", Collection, {"filterName": "somename", "filterArguments": "someargs"});
	}


	this.filterName = filterName || "FilterGetAll"; // The default collection is everything in the repository.
	this.filterArguments = filterArguments || []; // The default filter function doesn't require any arguments.
	Object.defineProperty(this, "items", {
		value: [],
		writable: true,
		configurable: false,
		enumerable: false,
	});
	this.repository.on('change', this.update.bind(this));
}
Collection.prototype = Object.create(RepositoryItem.prototype);
Collection.constructor = Collection;
Collection.prototype.update = function(input){
	var previousItems = this.items.slice();
	input = input || this.repository.everything();
	this.items = input.filter(this[this.filterName].apply(null, this.filterArguments)); // Filter through every item in the repository to get our items
	if(!_.isEqual(this.items, previousItems)){
		this.trigger("change");
	}
};
// I've removed the toJSON function.  As long as all variables that shouldn't
// appear in the Stringify object should be added using Object.prototype with enumerable equal to false.


/**
 * These are filter functions. They allow the collection to choose what items are in it.
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
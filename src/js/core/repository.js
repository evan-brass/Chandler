'use strict';

function Repository(id){
	this.id = id || "Primary Repository";
	this.generateUUID = function() { // doesn't affect the repository: no change event
	    var d = new Date().getTime();
	    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	        var r = (d + Math.random()*16)%16 | 0;
	        d = Math.floor(d/16);
	        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	    });
	    return uuid;
	};
	this.updateCollections = function(){
		this.trigger('change', this.everything());
	};
	this.saveItem = function(item){ // This does affect the repository: fire a change event
		localStorage.setItem(item.id, JSON.stringify(item));
		this.updateCollections();
	};
	this.fetchItem = function(id){ // doesn't affect the repository: no change event
		var item = localStorage.getItem(id);
		if(item == null){
			console.log("Error, no item to fetch");
			return {};
		} else {
			var temp = JSON.parse(item);
			temp.id = id;
			return temp;
		}
	};
	this.destroyItem = function(id){ // This does affect the repository: fire a change event
		localStorage.removeItem(id);
		this.updateCollections();
	};
	this.everything = function(){ // doesn't affect the repository: no change event
		var array = [];
		for(var i = 0; i < localStorage.length; ++i){
			array.push(typeManager.parse(this.fetchItem(localStorage.key(i))));
		}
		return array;
	};
	this.debug = {
		dump: function(){
			for(var i = 0; i < localStorage.length; ++i){
				console.log(localStorage.key(i)+localStorage.getItem(localStorage.key(i)));
			}
		},
		clear: function (){
			localStorage.clear();
		},
		usage: function(){

		},
	};

}
Repository.prototype = {};
Repository.constructor = Repository;
Eventable(Repository);
// Here we are creating the primary repository.
window.repository = new Repository();

/**
 * Anything that goes into the repository must inherit Repository Item.  It is the fundamental interface to the repository.
 */
function RepositoryItem(repository){
	Object.defineProperty(this, "repository", {
		value: repository || window.repository,
		writable: true,
		enumerable: false
	});
	this.repository = repository || window.repository;
	Object.defineProperty(this, "id", {
		value: this.repository.generateUUID(),
		writable: true,
		enumerable: false
	});
}
//typeManager.registerType("RepositoryItem", RepositoryItem, {}); // The sample is {} because anything that isn't something else is a repository item.
RepositoryItem.prototype.save = function(){
	this.repository.saveItem(this);
};
RepositoryItem.prototype.fetch = function(){
	_.extend(this, this.repository.fetchItem(this.id));
};
RepositoryItem.prototype.destroy = function(){
	this.repository.destroyItem(this.id);
};

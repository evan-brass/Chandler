'use strict';

function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};

window.Repository = (function(){
	/* View stuff */
	var views = []; // Currently, every view will be updated for every change to the repository.
	function updateViews(){
		for (var i = 0; i < views.length; ++i){
			var view = views[i];
			view.render();
		}
	}

	/* Item Functions */
	function saveItem(item){
		localStorage.setItem(item.id, JSON.stringify(item));
		updateViews();
	}
	function fetchItem(id){
		var item = localStorage.getItem(id);
		if(item == null){
			console.log("Error, no item to fetch");
			return {};
		} else {
			return JSON.parse(item);
		}
	}
	function destroyItem(id){
		localStorage.removeItem(id);
		updateViews();
	}

	// Everything returns every item in the repository.  It is used by collections to filter items into their array of items.
	function everything(){
		var array = [];
		for(var i = 0; i < localStorage.length; ++i){
			array.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
		}
		return array;
	}

	/* Debug Options */
	function repoDump(){
		for(var i = 0; i < localStorage.length; ++i){
			console.log(localStorage.getItem(localStorage.key(i)));
		}
	}
	function repoClear(){
		localStorage.clear();
		updateViews();
	}

	return {
		/* View Interface */
		"registerViewRenderer": function(func){
			views.push(func);
		},
		"unregisterViewRenderer": function(func){
			var index;
			if((index = viewRenderers.indexOf(func)) != -1){
				views.slice(index, index + 1);
			}
		},

		/* Item Interface */
		"saveItem" : function(item){
			saveItem(item);
		},
		"fetchItem" : function(id){
			return fetchItem(id);
		},
		"destroyItem" : function(id){
			destroyItem(id);
		},

		// Used by collections
		"everything" : function(){
			return everything();
		},

		/* Debug Interface */
		"debug" : {
			"dump" : function(){
				repoDump();
			},
			"clear" : function(){
				repoClear();
			},
		}
	};
})();

/**
 * Anything that goes into the repository must inherit Repository Item.  It is the fundamental interface to the repository.
 */
function RepositoryItem(){
	this.id = generateUUID();
}
RepositoryItem.prototype.save = function(){
	Repository.saveItem(this);
};
RepositoryItem.prototype.fetch = function(){
	_.extend(this, Repository.fetchItem(this.id));
};
RepositoryItem.prototype.destroy = function(){
	Repository.destroyItem(this.id);
};

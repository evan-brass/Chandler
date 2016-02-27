'use strict';

// Should views be able to be saved to the repository?
// Views won't be stored in the repository because it would cause confusing state things.
// Instead, views will need to be created every time that the program needs them.

function View(name){
	this.name = name || "Unnamed View";
	this.element = this.element || document.createElement('div');
}
View.prototype = {};
View.constructor = View;

View.prototype.render = function(){
	alert("Render function was not overloaded.");
};


// Generic widget is useless, don't use it!
function Widget(){
	this.element = document.createElement("span");
	this.element.innerHTML = "Hi, This widget shouldn't have called the Widget function.  That is all.";
}
Widget.prototype = {};

/**
 * The Table widget is useful when you want a collection driven
 */
function Table(collection){
	this.collection = collection || new collection();
	this.collection.update();
	this.element = document.createElement("div");
}
Table.prototype = Object.create(Widget.prototype);
Table.constructor = Table;
Table.prototype.render = function(){

};

'use strict';

/**
 * The Layout is a kind of view that allows inserting more views into it.
 */
function Layout(view, neighbors, size, position){
	if(!LayoutItem.prototype.stylesLoaded){
		var styles = {"LayoutItem":
			".LayoutItem{" +
				"border: 1px solid black;" +
				"box-sizing: border-box;" +
			"}"
		};
		for (var handle in styles) {
			userinterface.styler.addStyle(handle, styles[handle]);
		}
		Window.prototype.stylesLoaded = true;
	}
	this.neighbors = neighbors || {"left": [], "right": [], "up": [], "down": []};
	this.position = position || {"left": 0, "top": 0};
	this.size = size || {"width": 100, "height": 100};
	this.element = document.createElement("div");
	this.element.className = "LayoutItem";

	this.view = view || false;
	this.render();
	RepositoryItem.call(this);
}
LayoutItem.prototype = Object.create(RepositoryItem.prototype);
LayoutItem.prototype.stylesLoaded = false;
LayoutItem.constructor = LayoutItem;
LayoutItem.prototype.resize = function(width, height){
	width = width || this.size.width;
	height = height || this.size.height;
	this.size = {"width": width, "height": height};
};
LayoutItem.prototype.reposition = function(left, top){
	left = left || this.position.left;
	top = top || this.position.top;
	this.position = {"left": left, "top": top};
};
LayoutItem.prototype.split = function(direction){
	/** warning
	 * This section is going to get really complicated.  This is why I hate user interface stuff, it makes my head hurt.
	 */
	switch(direction){
		case "horizontal":
			// We have more than 1 neighbor on top but the bottom has 1 neighbor or less
			if(this.neighbors.up.length > 1 && this.neighbors.down.length <= 1){
				// Do we have an even number of neighbors up?
				if(this.neighbors.up.length % 2 == 0){
					// If so than we should split to match the layout of the items above (split between the center items (not neccessarily the center of this item))
					var rightIndex = this.neighbors.up.length/2;
					var leftSide = this; // The original layoutItem becomes the new left side;
					var rightWidth = 0;
					for(var i = rightIndex; i < this.neighbors.up.length; ++i){
						rightWidth += this.neighbors.up[i].size.width;
					}
					var leftWidth = 0;
					for(var i = 0; i < rightIndex; ++i){
						leftWidth += this.neighbors.up[i].size.width;
					}
					var rightSide = new LayoutItem(false,
						{
							"left": leftSide,
							"right": this.neighbors.right,
							"up": this.neighbors.up.slice(rightIndex, this.neighbors.up.length),
							"down": this.neighbors.down
						}, {
							"width": rightWidth,
							"height": this.size.height
						}, {
							"left": this.neighbors.up[rightIndex].position.left,
							"top": this.position.top
						});
				}
			}
		break;
		case "horizontal":

		break;
		default:
		var er = new Error("LayoutItem: Unable to split along " + direction);
		console.log(er);
		return er;
		break;
	}
};
LayoutItem.prototype.render = function(){
	this.element.style.top = this.position.top + "px";
	this.element.style.left = this.position.left + "px";
	this.element.style.width = this.size.width + "px";
	this.element.style.height = this.size.height + "px";

	if(this.view){
		this.view.render();
	}
};

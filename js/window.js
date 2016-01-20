'use strict';

/**
 * A window is a group of views.  Generally, an app would have one window with many views but it isn't neccessary.
 * For example, it might be worth having a few different windows for the main screen,
 */
function Window(element, title) {
	if (!Window.prototype.stylesLoaded) {
		var styles = {
			"Window" : ".window{" +
					"height: 100%;" +
					"box-sizing: border-box;" +
				"}" +
				".window > .container{" +
					"height: calc(100% - 60px);" +
				"}",
		};
		for (var handle in styles) {
			userinterface.styler.addStyle(handle, styles[handle]);
		}
		Window.prototype.stylesLoaded = true;
	}
	if (!element) {
		this.element = document.createElement("div");
		this.element.className = "window";
		document.body.appendChild(this.element);
	} else {
		this.element = element;
	}
	this.layout = [];
	this.container = document.createElement("div");
	this.container.className = "container";
	var title = new WindowTitleWidget(title);
	this.element.appendChild(title.element);
	this.layout.push(title);
	this.element.appendChild(this.container);

	this.render();
	RepositoryItem.call(this);
}

Window.prototype = Object.create(RepositoryItem.prototype);
Window.constructor = Window;
Window.prototype.stylesLoaded = false;
Window.prototype.addLayout = function(item) {
	this.layout.push(item);
	this.container.appendChild(item.element);
};
Window.prototype.removeLayout = function(item) {
	if (this.layout.indexOf(item) != -1) {
		this.layout.splice(this.layout.indexOf(item), 1);
		this.container.removeChild(item.element);
	} else {
		var er = new Error("Window: I can't remove a LayoutItem that I don't have.");
		console.log(er);
		return er;
	}
};
Window.prototype.render = function() {
	for(var i = 0; i < this.layout.length; ++i){
		this.layout[i].render();
	}
};
Window.prototype.edit = function(trueOrFalse){
	for(var i = 0; i < this.children.length; ++i){
		if(this.children[i].edit){
			this.children[i].edit(trueOrFalse);
		}
	}
};


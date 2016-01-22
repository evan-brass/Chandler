// Generic widget is useless, don't use it!
function Widget() {
	if(!this.element){
		this.element = document.createElement('div');
	}
	this.element.className += " widget";
	if(!Widget.prototype.widgetStylesLoaded){
		Widget.prototype.loadWidgetStyles();
	}
}
Widget.prototype = {};
Widget.stylesLoaded = false;
Widget.prototype.loadWidgetStyles = function(){
	var styles = {
		"Widgets" : ".widget{" +
				"font-family: 'Open Sans', sans-serif;" +
				"box-sizing: border-box;" +
			"}",
	};
	for (var handle in styles) {
		userinterface.styler.addStyle(handle, styles[handle]);
	}
	Widget.prototype.widgetStylesLoaded = true;
};
Widget.prototype.render = function(){

};

/**
 * The TitleHeaderWidget is used by the window.
 */
function WindowTitleWidget(title){
	title = title || "The Window's Title";
	if(!WindowTitleWidget.prototype.windowTitleStylesLoaded){
		WindowTitleWidget.prototype.loadWindowTitleWidgetStyles();
	}
	Widget.call(this);

	this.element.className += " widget-windowTitle";
	var titleEl = document.createElement("h1");
	titleEl.innerHTML = title;
	this.element.appendChild(titleEl);
}
WindowTitleWidget.prototype = Object.create(Widget.prototype);
WindowTitleWidget.constructor = WindowTitleWidget;
WindowTitleWidget.prototype.render = function(){

};
WindowTitleWidget.prototype.loadWindowTitleWidgetStyles = function(){
	var styles = {
		"WindowTitleWidget" : ".widget-windowTitle{" +
				"height: 60px;" +
				"color: " + userinterface.color.getAnAccent() + ";" +
			"}" +
			".widget-windowTitle > h1{" +
				"margin: 0;" +
				"padding: 10px;" +
			"}",
	};
	for (var handle in styles) {
		userinterface.styler.addStyle(handle, styles[handle]);
	}
	WindowTitleWidget.prototype.windowTitleStylesLoaded = true;
};

/**
 * The Menu Widget is useful for things like tabs.
 */
function MenuWidget(items, callback) {
	if (!MenuWidget.prototype.menuWidgetStylesLoaded) {
		this.loadMenuWidgetStyles();
	}
	this.items = items || [];
	this.active = this.items[0];
	this.callback = function(callback, item){
		this.active = item;
		this.render();
		callback(item);
	}.bind(this, callback);
	this.element = document.createElement("div");
	this.element.className = "widget widget-menu";
	this.callback(this.active);
}

MenuWidget.prototype = Object.create(Widget.prototype);
MenuWidget.constructor = MenuWidget;
MenuWidget.prototype.addMenuItem = function(item) {
	this.items.push(item);
};
MenuWidget.prototype.loadMenuWidgetStyles = function(){
	var styles = {
		"MenuWidget" : ".widget-menu{" +
				"height: 40px;" +
				"background-color: " + userinterface.color.getAnAccent() + ";" +
				"text-align: center;" +
			"}",
		"MenuWidget-button" : ".widget-menu > button{" +
				"transition: all .1s;" +
				"background-color: transparent;" +
				"border: none;" +
				"display: inline-block;" +
				"height: 100%;" +
				"padding: 10px;" +
				"line-height: 20px;" +
				"font-size: 15px;" +
				"font-weight: bold;" +
				"color: " + userinterface.color.getBase() + ";" +
			"}" +
			".widget-menu > button:hover, .widget-menu > button.active{" +
				"background-color: rgba(255,255,255, 0.3);" +
			"}",
	};
	for (var handle in styles) {
		userinterface.styler.addStyle(handle, styles[handle]);
	}
	MenuWidget.prototype.menuWidgetStylesLoaded = true;
};
MenuWidget.prototype.render = function(){
	this.element.innerHTML = "";
	for (var i = 0; i < this.items.length; ++i){
		var item = this.items[i];
		var button = document.createElement("button");
		if(item == this.active){
			button.className = "active";
		}
		button.onclick = this.callback.bind(null, item);
		button.innerHTML = item;
		this.element.appendChild(button);
	}
};

function htmlWidget(html){
	Widget.call(this);
	this.element.innerHTML = html;
}
htmlWidget.prototype = Object.create(Widget.prototype);
htmlWidget.consructor = htmlWidget;

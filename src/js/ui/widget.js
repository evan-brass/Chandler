window.Widgets = window.Widgets || {};

// Generic widget is useless, don't use it!
Widgets.Generic = function() {
	if (!this.element) {
		this.element = document.createElement('div');
	}
	this.element.className += " widget";
	if (!Widgets.Generic.prototype.widgetStylesLoaded) {
		Widgets.Generic.prototype.loadWidgetStyles();
	}
};
Widgets.Generic.prototype = {};
Widgets.Generic.stylesLoaded = false;
Widgets.Generic.prototype.loadWidgetStyles = function() {
	var styles = {
		"Widgets" : ".widget{" + "font-family: 'Open Sans', sans-serif;"
				+ "box-sizing: border-box;" + "}",
	};
	for ( var handle in styles) {
		userinterface.styler.addStyle(handle, styles[handle]);
	}
	Widgets.Generic.prototype.widgetStylesLoaded = true;
};
Widgets.Generic.prototype.render = function() {

};

/**
 * The TitleHeaderWidget is used by the window.
 */
Widgets.WindowTitleWidget = function(title) {
	title = title || "The Window's Title";
	if (!Widgets.WindowTitleWidget.prototype.windowTitleStylesLoaded) {
		Widgets.WindowTitleWidget.prototype.loadWindowTitleWidgetStyles();
	}
	Widgets.Generic.call(this);

	this.element.className += " widget-windowTitle";
	var titleEl = document.createElement("h1");
	titleEl.innerHTML = title;
	this.element.appendChild(titleEl);
};
Widgets.WindowTitleWidget.prototype = Object.create(Widgets.Generic.prototype);
Widgets.WindowTitleWidget.constructor = Widgets.WindowTitleWidget;
Widgets.WindowTitleWidget.prototype.render = function() {

};
Widgets.WindowTitleWidget.prototype.loadWindowTitleWidgetStyles = function() {
	var styles = {
		"WindowTitleWidget" : ".widget-windowTitle{" + "height: 60px;"
				+ "color: " + userinterface.color.getAnAccent() + ";" + "}"
				+ ".widget-windowTitle > h1{" + "margin: 0;" + "padding: 10px;"
				+ "}",
	};
	for ( var handle in styles) {
		userinterface.styler.addStyle(handle, styles[handle]);
	}
	Widgets.WindowTitleWidget.prototype.windowTitleStylesLoaded = true;
};

/**
 * The Menu Widget is useful for things like tabs.
 */
Widgets.MenuWidget = function(items, callback) {
	if (!Widgets.MenuWidget.prototype.menuWidgetStylesLoaded) {
		this.loadMenuWidgetStyles();
	}
	this.items = items || [];
	this.active = this.items[0];
	this.callback = function(callback, item) {
		this.active = item;
		this.render();
		callback(item);
	}.bind(this, callback);
	this.element = document.createElement("div");
	this.element.className = "widget widget-menu";
	this.callback(this.active);
};

Widgets.MenuWidget.prototype = Object.create(Widgets.Generic.prototype);
Widgets.MenuWidget.constructor = Widgets.MenuWidget;
Widgets.MenuWidget.prototype.addMenuItem = function(item) {
	this.items.push(item);
};
Widgets.MenuWidget.prototype.loadMenuWidgetStyles = function() {
	var styles = {
		"MenuWidget" : ".widget-menu{" + "height: 40px;" + "background-color: "
				+ userinterface.color.getAnAccent() + ";"
				+ "text-align: center;" + "}",
		"MenuWidget-button" : ".widget-menu > button{" + "transition: all .1s;"
				+ "background-color: transparent;" + "border: none;"
				+ "display: inline-block;" + "height: 100%;" + "padding: 10px;"
				+ "line-height: 20px;" + "font-size: 15px;"
				+ "font-weight: bold;" + "color: "
				+ userinterface.color.getBase() + ";" + "}"
				+ ".widget-menu > button:hover, .widget-menu > button.active{"
				+ "background-color: rgba(255,255,255, 0.3);" + "}",
	};
	for ( var handle in styles) {
		userinterface.styler.addStyle(handle, styles[handle]);
	}
	Widgets.MenuWidget.prototype.menuWidgetStylesLoaded = true;
};
Widgets.MenuWidget.prototype.render = function() {
	this.element.innerHTML = "";
	for (var i = 0; i < this.items.length; ++i) {
		var item = this.items[i];
		var button = document.createElement("button");
		if (item == this.active) {
			button.className = "active";
		}
		button.onclick = this.callback.bind(null, item);
		button.innerHTML = item;
		this.element.appendChild(button);
	}
};

Widgets.htmlWidget = function (html) {
	Widgets.Generic.call(this);
	this.element.innerHTML = html;
};
Widgets.htmlWidget.prototype = Object.create(Widgets.Generic.prototype);
Widgets.htmlWidget.consructor = Widgets.htmlWidget;

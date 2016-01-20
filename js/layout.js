'use strict';

/**
 * The Layout is a kind of view that allows inserting more views into it.
 */
function Layout(){
	if(!this.layoutStylesLoaded){
		this.loadLayoutStyles();
	}
	this.name = this.name || "Layout";
	this.element = this.element || document.createElement('div');
	this.element.className += " layout";
	this.children = [];
}
Layout.prototype = {};
Layout.constructor = Layout;
Layout.prototype.addChild = function(child){
	this.children.push(child);
	this.element.appendChild(child.element);
};
Layout.prototype.removeChild = function(child){
	if(this.children.indexOf(child) != -1){
		var old = this.children.splice(this.children.indexOf(child), 1);
		this.element.removeChild(old.element);
	} else {
		var er = new Error("Layout: I can't remove a child that I don't have.  That is all.");
		console.warn(er);
	}
};
Layout.prototype.render = function(){
	this.children.forEach(function(item, index, array){
		item.render();
	}, this);
};
Layout.prototype.loadLayoutStyles = function(){
	var styles = {
		"Layout" : ".layout{" +
				"position: relative;" +
				"height: 100%;" +
				"width: 100%;" +
				"border: 1px solid " + userinterface.color.getAnAccent() + ";" +
				"box-sizing: border-box;" +
			"}",
	};
	for (var handle in styles) {
		userinterface.styler.addStyle(handle, styles[handle]);
	}
	Layout.prototype.layoutStylesLoaded = true;
};

/**
 * The tabbed layout just has a menu at the top to select which tab is active.
 */
function LayoutTabs(tabNames){
	if(!this.layoutTabsStylesLoaded){
		this.loadLayoutTabsStyles();
	}
	Layout.call(this);
	this.element.className += " layout-tabs";

	this.tabNames = tabNames || ["Unnamed Tab"];
	this.tabs = {};
	for(var i = 0; i < this.tabNames.length; ++i){
		var page = document.createElement("div");
		page.className = "page";
		this.tabs[this.tabNames[i]] = page;
		this.element.appendChild(page);
	}
	this.menu = new MenuWidget(this.tabNames, this.newActiveTab.bind(this));
	this.children.push(this.menu);
	this.element.appendChild(this.menu.element);

	this.newActiveTab(this.tabNames[0]);
	this.render();
}
LayoutTabs.prototype = Object.create(Layout.prototype);
LayoutTabs.constructor = LayoutTabs;
LayoutTabs.prototype.addChild = function(tabName, item){
	tabName = tabName || this.tabNames[0];
	this.children.push(item);
	this.tabs[tabName].appendChild(item);
};
LayoutTabs.prototype.removeChild = function(){
	if(this.children.indexOf(child) != -1){
		var old = this.children.splice(this.children.indexOf(child), 1);
		old.element.parentElement.removeChild(old.element);
	} else {
		var er = new Error("LayoutTabs: I can't remove a child that I don't have.  That is all.");
		console.warn(er);
	}
};
LayoutTabs.prototype.newActiveTab = function(newActive){
	for (var tabName in this.tabs){
		this.tabs[tabName].className = this.tabs[tabName].className.replace("active", "").trim();
	}
	this.tabs[newActive].className += " active";
};
LayoutTabs.prototype.loadLayoutTabsStyles = function(){
	var styles = {
		"LayoutTabs" : ".layout-tabs{" +
				"position: relative;" +
				"height: 100%;" +
				"border: 1px solid " + userinterface.color.getAnAccent() + ";" +
				"box-sizing: border-box;" +
			"}",
		"LayoutTabs-page" : ".layout-tabs > .page{" +
				"position: absolute;" +
				"left: 0;" +
				"top: 40px;" +
				"display: none;" +
				"height: calc(100% - 40px);" +
				"width: 100%;" +
			"}" +
			".layout-tabs > .page.active{" +
				"display: block;" +
			"}",
	};
	for (var handle in styles) {
		userinterface.styler.addStyle(handle, styles[handle]);
	}
	LayoutTabs.prototype.layoutTabsStylesLoaded = true;
};

/**
 * Just simple Columns, That said, nothing seems to end up being "just simple."
 */
function LayoutColumns(){
	if(!LayoutColumns.prototype.LayoutColumnsStylesLoaded){
		LayoutColumns.prototype.loadLayoutColumnsStyles();
	}
	Layout.call(this);
	this.element.className += " layout-columns";
	this.columns = [];
}
LayoutColumns.prototype = Object.create(Layout.prototype);
LayoutColumns.constructor = LayoutRows;
LayoutColumns.prototype.addChild = function(child){
	var newColumn = document.createElement('div');
	newColumn.className = "column";
	this.element.appendChild(newColumn);
	this.columns.push(newColumn);
	newColumn.appendChild(child.element);
	this.children.push(child);
	this.render();
};
LayoutColumns.prototype.removeChild = function(){
	if(this.children.indexOf(child) != -1){
		var old = this.children.splice(this.children.indexOf(child), 1);
		old.element.parentElement.removeChild(old.element);
	} else {
		var er = new Error("LayoutTabs: I can't remove a child that I don't have.  That is all.");
		console.warn(er);
	}
	this.render();
};
LayoutColumns.prototype.render = function(){
	for(var i = 0; i < this.columns.length; ++i){
		this.columns[i].style.width = 100/this.columns.length + "%";
	}
	this.children.forEach(function(item, index, array){
		item.render();
	}, this);
};
LayoutColumns.prototype.loadLayoutColumnsStyles = function(){
	var styles = {
		"LayoutColumns" : ".layout-columns{" +
				"position: relative;" +
				"height: 100%;" +
				"box-sizing: border-box;" +
			"}" +
			".layout-columns > .column{" +
				"height: 100%;" +
				"float: left;" +
			"}",
	};
	for (var handle in styles) {
		userinterface.styler.addStyle(handle, styles[handle]);
	}
	LayoutColumns.prototype.LayoutColumnsStylesLoaded = true;
};

/**
 * Just simple rows.
 *
 */
function LayoutRows(){
	Layout.call(this);
	this.element.className += " layout-rows";
	this.rows = [];
}
LayoutRows.prototype = Object.create(Layout.prototype);
LayoutRows.constructor = LayoutRows;
LayoutRows.prototype.addChild = function(child){
	var newRow = document.createElement('div');
	this.element.appendChild(newRow);
	this.rows.push(newRow);
	newRow.appendChild(child.element);
	this.children.push(child);
	this.render();
};
LayoutRows.prototype.removeChild = function(){
	if(this.children.indexOf(child) != -1){
		var old = this.children.splice(this.children.indexOf(child), 1);
		old.element.parentElement.removeChild(old.element);
	} else {
		var er = new Error("LayoutTabs: I can't remove a child that I don't have.  That is all.");
		console.warn(er);
	}
	this.render();
};
LayoutRows.prototype.render = function(){
	for(var i = 0; i < this.rows.length; ++i){
		this.rows[i].style.height = 100/this.rows.length + "%";
	}
	this.children.forEach(function(item, index, array){
		item.render();
	}, this);
};

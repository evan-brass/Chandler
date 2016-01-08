"use strict";

/**
 * The LayoutItem is a data structure that is used to render a window.  It has width and height information which transfers to the container
 */
function LayoutItem(view, neightbors){
	this.neigbors = neightbors || {left: null, right: null, up: null, down: null};

	this.view = view;
	RepositoryItem.call(this);
}
LayoutItem.prototype = Object.create(RepositoryItem.prototype);
LayoutItem.constructor = LayoutItem;
LayoutItem.prototype.render = function(){
	this.view.render();
};

/**
 * A window is a group of views.  Generally, an app would have one window with many views but it isn't neccessary.
 * For example, it might be worth having a few different windows for the main screen,
 */
function Window(element, width, height){
	if(!element){
		this.element = document.createElement("div");
		document.body.appendChild(this.element);
	} else {
		this.element = element;
	}
	this.width = width || 1000;
	this.height = height || 900;
	this.element.style.width = this.width + "px";
	this.element.style.height = this.height + "px";
	this.layout = {};

	this.render();
	RepositoryItem.call(this);
}
Window.prototype = Object.create(RepositoryItem.prototype);
Window.constructor = Window;
Window.prototype.addLayoutItem = function(item){
	this.layout[item.id] = item;
};
Window.prototype.addView = function(view){
	this.addLayoutItem(new LayoutItem(view));
};
Window.prototype.removeView = function(view){

};
Window.prototype.resizeBorder = function(borderId){

};
Window.prototype.render = function(){

};


window.userinterface = {
	color : {
		palleteOld : {
			"accents" : ["ce3520", "ce812e", "c3b449", "50cc60", "50cc75"],
			"base" : "E5E5E5",
			"text" : "2E2E2E",
		},
		palleteOld2 : {
			"accents" : ["red", "navy"],
			"base" : "white",
			"text" : "black",
		},
		pallete : {
			"accents" : ["63286b", "723470", "82aae5"],
			"base" : "F0F2EF",
			"text" : "5C5346",
		},
		getBase : function() {
			return "#" + this.pallete.base;
		},
		getText : function() {
			return "#" + this.pallete.text;
		},
		getAnAccent : function() {/* Color should be saved per use because it will be different each time */
			var min = 0;
			var max = this.pallete.accents.length - 1;
			return "#" + this.pallete.accents[Math.floor(Math.random() * (max - min + 1)) + min];
		},
	},
	windows : {
		overlayElement : null,
		notificationsElement: null,
		stylesLoaded : false,
		loadStyles : function() {
			var dialogAccent = userinterface.color.getAnAccent();
			var styles = {
				"windows-fonts" : "@import url(https://fonts.googleapis.com/css?family=Open+Sans:400,700);",
				"windows-dialogs" : ".dialog{" +
						"color: " + userinterface.color.getText() + ";" +
						"overflow: hidden;" +
						"font-family: 'Open Sans', sans-serif;" +
						"box-shadow: #777 0 0 10px;" +
						"position: fixed;" +
						"left: 50%;" +
						"top: 50%;" +
						"transform: translate(-50%, -50%);" +
						"z-index: 101;" +
						"min-width: 200px;" +
						"min-height: 50px;" +
						"background-color: " + userinterface.color.getBase() + ";" +
						"text-align: center;" +
					"}" +
					".dialog .message{" +
						"padding: 0 30px;" +
						"" +
					"}" +
					".dialog .title{" +
						"padding: 10px 30px;" +
						"background-color: #ccc;" +
						"text-align: left;" +
						"font-weight: bold;" +
						"color: " + dialogAccent + ";" +
					"}" +
					".dialog button{" +
						"transition: all .3s;" +
						"padding: 5px;" +
						"margin: 5px;" +
						"background-color: transparent;" +
						"font-weight: bold;" +
						"width: 90px;" +
					"}" +
					".dialog .ok{" +
						"color:" + dialogAccent + ";" +
						"border: 1px solid " + dialogAccent + ";" +
					"}" +
					".dialog .ok:hover{" +
						"background-color: " + dialogAccent + ";" +
						"color: " + userinterface.color.getBase() + ";" +
					"}" +
					".dialog .yes{" +
						"color: #50cc60;" +
						"border: 1px solid #50cc60;" +
					"}" +
					".dialog .yes:hover{" +
						"background-color: #50cc60;" +
						"color: " + userinterface.color.getBase() + ";" +
					"}" +
					".dialog .done{" +
						"color: #4f76cc;" +
						"border: 1px solid #4f76cc;" +
					"}" +
					".dialog .done:hover{" +
						"background-color: #4f76cc;" +
						"color: " + userinterface.color.getBase() + ";" +
					"}" +
					".dialog .no{" +
						"color: #ce3520;" +
						"border: 1px solid #ce3520;" +
					"}" +
					".dialog .no:hover{" +
						"background-color: #ce3520;" +
						"color: " + userinterface.color.getBase() + ";" +
					"}" +
					".dialog .cancel{" +
						"color: #ce812e;" +
						"border: 1px solid #ce812e;" +
					"}" +
					".dialog .cancel:hover{" +
						"background-color: #ce812e;" +
						"color: " + userinterface.color.getBase() + ";" +
					"}",
				"windows-overlay" : "#overlay{" +
						"background-color: #000;" +
						"z-index: 100;" +
						"opacity: .5;" +
						"position: fixed;" +
						"top: 0;" +
						"left: 0;" +
						"width: 100%;" +
						"height: 100%;" +
						"display: none;" +
					"}" +
					"#overlay.active{" +
						"display: block;" +
					"}",
				"windows-notifications": "#notifications{" +
						"font-family: 'Open Sans';" +
						"position: fixed;" +
						"right: 0;" +
						"bottom: 0;" +
						"width: 300px;" +
						"margin: 0;" +
						"padding: 3px;" +
						"" +
					"}" +
					"#notifications li{" +
						"background-color: " + userinterface.color.getBase() + ";" +
						"border-left: 5px solid pink;" +
						"list-style: none;" +
						"margin: 3px;" +
						"padding: 10px;" +
						"color: " + userinterface.color.getText() + ";" +
						"font-weight: bold;" +
					"}" +
					"#notifications .notice{" +
						"border-color: #4f76cc;" +
					"}" +
					"#notifications .warning{" +
						"border-color: #ce812e;" +
					"}" +
					"#notifications .error{" +
						"border-color: #ce3520;" +
					"}",
			};
			for (var handle in styles) {
				userinterface.styler.addStyle(handle, styles[handle]);
			}
			this.stylesLoaded = true;
		},
		activateOverlay : function() {
			if (!this.stylesLoaded) {
				this.loadStyles();
			}
			if (this.overlayElement == null) {
				this.overlayElement = document.createElement("div");
				this.overlayElement.id = "overlay";
				document.body.appendChild(this.overlayElement);
			}
			this.overlayElement.className += " active";
		},
		deactivateOverlay : function() {
			if (!this.stylesLoaded) {
				this.loadStyles();
			}
			if (this.overlayElement == null) {
				this.overlayElement = document.createElement("div");
				this.overlayElement.id = "overlay";
				document.body.appendChild(this.overlayElement);
			}
			this.overlayElement.className = this.overlayElement.className.replace("active", "").trim();
		},
		/**
		 * Dialog always returns a Promise.
		 * It rejects with an error sometimes but it also rejects if the answer is anything but ok, or yes, or something similiar.
		 * If the dialog completes with a button press other than ok or yes, the promise is rejected with that value (cancel, no or similiar).
		 */
		dialog : function(message, title, type, validate) {
			type = type || "ok";
			title = title || false;
			validate = validate || function(){return true;};
			if (!this.stylesLoaded) {
				this.loadStyles();
			}
			if (!message) {
				var er = new Error("windows: No message was supplied to the dialog function.");
				console.log(er);
				return new Promise( function(er, resolve, reject) {
					reject(er);
				}.bind(this, er));
			}
			return new Promise( function(message, title, type, validate, resolve, reject) {
				var dialogContainer = document.createElement("dialog");
				dialogContainer.className = "dialog";
				if(title){
					dialogContainer.innerHTML += "<div class='title'>" + title + "</div>";
				}
				dialogContainer.innerHTML += "<p class='message'>" + message + "</p>";
				var cleanup = function() {
					this.deactivateOverlay.call(this);
					dialogContainer.parentNode.removeChild(dialogContainer);

				}.bind(this, dialogContainer);
				var hasButton = false;
				if(type.indexOf('ok') != -1){
					var okButton = document.createElement("button");
					okButton.className = "ok";
					okButton.innerHTML = "Ok";
					okButton.addEventListener('click', function(resolve, cleanup, validate, dialogContainer) {
						if(validate(dialogContainer)){ // Validate should edit the contents of the dialog to reflect and invalid fields
							cleanup();
							resolve('ok');
						}
					}.bind(this, resolve, cleanup, validate, dialogContainer));
					dialogContainer.appendChild(okButton);
					hasButton = true;
				}
				if(type.indexOf('done') != -1){
					var doneButton = document.createElement("button");
					doneButton.className = "done";
					doneButton.innerHTML = "Done";
					doneButton.addEventListener('click', function(resolve, cleanup, validate, dialogContainer) {
						if(validate(dialogContainer)){
							cleanup();
							resolve('done');
						}
					}.bind(this, resolve, cleanup, validate, dialogContainer));
					dialogContainer.appendChild(doneButton);
					hasButton = true;
				}
				if(type.indexOf('yes') != -1){
					var yesButton = document.createElement("button");
					yesButton.className = "yes";
					yesButton.innerHTML = "Yes";
					yesButton.addEventListener('click', function(resolve, cleanup, validate, dialogContainer) {
						if(validate(dialogContainer)){
							cleanup();
							resolve('yes');
						}
					}.bind(this, resolve, cleanup, validate, dialogContainer));
					dialogContainer.appendChild(yesButton);
					hasButton = true;
				}
				if(type.indexOf('no') != -1){
					var noButton = document.createElement("button");
					noButton.className = "no";
					noButton.innerHTML = "No";
					noButton.addEventListener('click', function(reject, cleanup) {
						cleanup();
						reject('no');
					}.bind(this, reject, cleanup));
					dialogContainer.appendChild(noButton);
					hasButton = true;
				}
				if(type.indexOf('cancel') != -1){
					var cancelButton = document.createElement("button");
					cancelButton.className = "cancel";
					cancelButton.innerHTML = "Cancel";
					cancelButton.addEventListener('click', function(reject, cleanup) {
						cleanup();
						reject('cancel');
					}.bind(this, reject, cleanup));
					dialogContainer.appendChild(cancelButton);
					hasButton = true;
				}
				if(!hasButton){
					var er = new Error("windows: The dialog must have at least one button, otherwise the user wouldn't be able to close it.");
					console.log(er);
					reject(er);
					return;
				}
				this.activateOverlay();
				document.body.appendChild(dialogContainer);
			}.bind(this, message, title, type, validate));
		},
		/**
		 * Notifications are useful for things that the user needs to deal with or know but shouldn't halt them right now.
		 */
		notification: function(message, type, ttl, clickCallback){
			if (!this.stylesLoaded) {
				this.loadStyles();
			}
			type = type || "notice";
			ttl = ttl || 5;
			clickCallback = clickCallback || false;
			if(ttl == 0 && !clickCallback){
				var er = new Error("windows: If a notification doesn't fade (has 0 ttl) than a click calback must be defined.");
				console.log(er);
				return new Promise(function(er, resolve, reject){
					reject(er);
				}.bind(this, er));
			}

			if(!this.notificationsElement){
				this.notificationsElement = document.createElement("ul");
				this.notificationsElement.id = "notifications";
				document.body.appendChild(this.notificationsElement);
			}

			if(!message){
				var er = new Error("windows: No message was supplied for the notification.");
				console.log(er);
				return new Promise(function(er, resolve, reject){
					reject(er);
				}.bind(this, er));
			}
			return new Promise(function(message, type, ttl, clickCallback, resolve, reject){
				var notice = document.createElement("li");
				notice.innerHTML = message;
				notice.className = type;
				var cleanup = function(value){
					value = value || "timed out";
					if(notice.parentNode){
						notice.parentNode.removeChild(notice);
						resolve(value);
					}
				}.bind(this, notice, resolve, reject);
				if(clickCallback){
					notice.addEventListener('click', function(clickCallback, cleanup){
						clickCallback();
						cleanup("clicked");
					}.bind(this, clickCallback, cleanup));
				} else {
					notice.addEventListener('click', cleanup.bind(this, notice));
				}
				if(ttl != 0){
					setTimeout(cleanup, 1000*ttl);
				}

				this.notificationsElement.appendChild(notice);
			}.bind(this, message, type, ttl, clickCallback));
		},
		/**
		 * Object should have all of the required properties so that they can be edited.
		 *
		 * This function assumes a RepositoryItem derived object as its input.
		 */
		editObject: function(object){
			var message = "<table>";
			for(var attr in object){
				if(object.hasOwnProperty(attr)){
					var val = object[attr];
					message += this.createEditField(attr, val);
				}
			}
			message += "</table>";
			var title = "Edit:";
			if(typeof object.name == 'function'){
				title += " " + object.name();
			}
			var type = "done-cancel";
			var validate = function(){
				return true;
			};
			return this.dialog(message, title, type, validate);
		},
		createEditField: function(attr, val){
			var field = "<tr><td>"; // We're creating a two column property editor.

			field += attr;

			field += "</td><td>";

			field += val;

			field += "</td></tr>";

			return field;
		},
	},
	styler : {
		styles : {},
		styleElement : null,
		addStyle : function(handle, style) {
			if ( typeof this.styles[handle] == 'undefined') {
				this.styles[handle] = style;
				this.renderStyles();
			} else {
				var er = new Error("styler-error: Attempted to create a style that already exists.");
				console.log(er);
				return er;
			}

		},
		removeStyle : function(handle) {
			if ( typeof this.styles[handle] != 'undefined') {
				delete this.styles[handle];
			} else {
				var er = new Error("styler-warning: Attempted to remove a style with a non existant handle.");
				console.log(er);
				return er;
			}
		},
		updateStyle : function(handle, newContent) {
			if ( typeof this.styles[handle] != 'undefined') {
				this.styles[handle] = style;
				this.renderStyles();
			} else {
				var er = new Error("styler-warning: Attempted to update a style that doesn't exist.");
				console.log(er);
				return er;
			}
		},
		getStylesheet: function(){
			if (this.styleElement == null) {
				this.styleElement = document.createElement('style');
				document.getElementsByTagName('head')[0].appendChild(this.styleElement);
			}
			return this.styleElement.innerHTML;
		},
		renderStyles : function() {
			if (this.styleElement == null) {
				this.styleElement = document.createElement('style');
				document.getElementsByTagName('head')[0].appendChild(this.styleElement);
				this.renderStyles();
			} else {
				this.styleElement.innerHTML = "";
				for (var key in this.styles) {
					var style = this.styles[key];
					this.styleElement.innerHTML += "/* [" + key + "]  */" + style;
				}
			}
		},
	},
};

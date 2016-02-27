'use strict';

/**
 * All eventable attributes are non enumarable so that they don't interfere with toJSON
 */
function Eventable(object) {
	object.prototype.on = function(event, callback) {
		if(!this.events){
			Object.defineProperty(this, "events", {
				value : {},
				writable : true,
				enumerable : false
			});
		}
		if (this.events[event]) {
			this.events[event].push(callback);
		} else {
			this.events[event] = new Array();
			this.events[event].push(callback);
		}
	};
	object.prototype.off = function(event, callback) {
			if(!this.events){
				Object.defineProperty(this, "events", {
					value : {},
					writable : true,
					enumerable : false
				});
			}
			if (event) {
				if (callback) {
					this.events[event].splice(this.events[event].indexOf(callback), 1);
				} else {
					this.events[event] = [];
				}
			} else {
				this.events = {};
			}
		};
	object.prototype.trigger = function() { // should be called with (EventName, [ArgumentsToPassToListeners, ...])
			if(!this.events){
				Object.defineProperty(this, "events", {
					value : {},
					writable : true,
					enumerable : false
				});
			}
			var args = [];
			var event = arguments[0];
			for (var i = 1; i < arguments.length; ++i) {
				args.push(arguments[i]);
			}
			if(this.events[event]){
				for(var i = 0;  i < this.events[event].length; ++i){
					var callback = this.events[event][i];
					callback.apply(null, args);
				}
			}
		};
}
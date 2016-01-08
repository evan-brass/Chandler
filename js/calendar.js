"use strict";

function Event(date, description) {
	this.date = date || new Date();
	this.description = description || "";
	this.type = "event";

	RepositoryItem.call(this);
}

Event.prototype = Object.create(RepositoryItem.prototype);
Event.constructor = Event;
Event.prototype.makeEvent = function(object) {
	var template = {
		id: this.id,
		date : new Date(),
		description : "",
	};
	delete object.id;
	if(object.type == "note"){
		template.description = object.content;
	}
	var temp = _.extend(template, object);
	temp.type = "event";
	return temp;
};

window.calendar = {
	view: null,
	dialogs: {
		createEvent: function(item){
			var newEvent = new Event();
			newEvent = newEvent.makeEvent(item);
			this.editEvent(newEvent);
		},
		editEvent: function(item){
			var dialog = document.createElement("div");
			dialog.className = "front-and-center";
			dialog.id = "editEvent-" + item.id;
			dialog.innerHTML = "<h2>Edit Event</h2>" +
				"Date: <input type='datetime' class='date'/><br>" +
				"Description: <input type='text' class='description'/><br>" +
				"<button class='doneEditing'>Done</button>";
			document.body.appendChild(dialog);
			// We eventually need to save the item: item.save()
		},
		deleteEvent: function(item){

		},
	},

	events : null,
	elements : [], // This will be initialized to an array of the elements.  7 columns x 5 rows = 35 elements
	monthNames : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	dayNames : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
	daysInMonth : function(month, year) {
		var year = year || 2015;
		// Default to a non leap year.
		if ([8, 3, 5, 10].indexOf(month) != -1) {// These are months with 30 days: September, April, June, November
			return 30;
		} else if (month != 1) {// Any month that doesn't have 30 days and isn't February
			return 31;
		} else {// This is February
			if (this.isLeapYear(year)) {
				return 29;
			} else {
				return 28;
			}
		}
	},
	isLeapYear : function(year) {
		if (year % 4 == 0 && year % 100 != 0) {
			return true;
		} else if (year % 400 == 0) {
			return true;
		} else {
			return false;
		}
	},
	populateElementsArray : function() {
		var calendarContainer = document.querySelector("table#calendar tbody");
		for (var i = 0; i < calendarContainer.children.length; ++i) {
			for (var i2 = 0; i2 < calendarContainer.children[i].children.length; ++i2) {
				this.elements.push(calendarContainer.children[i].children[i2]);
			}
		}
	},
	getFirstDay : function(month, year) {
		var firstOfTheMonth = new Date(year, month, 1);
		return firstOfTheMonth.getDay();
	},
	initialize : function() {
		this.events = new Collection("FilterGetWhereTypeIs", ["event"]);
		this.view = new View(this.events, document.getElementById("calendar"));
		this.view.render = this.renderCalendar.bind(this);

		this.populateElementsArray();

		this.renderCalendar();
	},
	renderCalendar : function() {
		this.events.update();
		var today = new Date();
		var days = this.daysInMonth(today.getMonth(), today.getFullYear());
		var curDay = this.getFirstDay(today.getMonth(), today.getFullYear());
		// this is element
		for (var i = 1; i <= days; ++i) {
			var date = new Date(today.getFullYear(), today.getMonth(), i);
			var daysEvents = this.events.items.filter( function(date, event) {
				var eventDate = new Date(event.date);
				if (date.getFullYear() == eventDate.getFullYear() && date.getMonth() == eventDate.getMonth() && date.getDate() == eventDate.getDate()) {
					return true;
				} else {
					return false;
				}
			}.bind(this, date), this);
			if( typeof this.elements[curDay] != 'undefined'){
				var element = this.elements[curDay];
				if (i == today.getDate()) {
					element.innerHTML = "<b style='color: red;'>" + i + "</b>";
				} else {
					element.innerHTML = "<b>" + i + "</b>";
				}
				if(daysEvents.length > 0){
					element.innerHTML += "<ul>";
					for(var eventIterator = 0; eventIterator < daysEvents.length; ++eventIterator){
						var event = daysEvents[eventIterator];
						var date = new Date(event.date);
						element.innerHTML += "<li><b>" + date.getHours() + "</b> " + event.description + "</li>";
					}
					element.innerHTML += "</ul>";
				}
				++curDay;
			} else {
				console.log("too many days");
			}
		}
	},
};

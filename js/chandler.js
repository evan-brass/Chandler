'use strict';
/**
 * Notes are simple objects (they are usually stamped into other objects) with only two common attributes: content and type, type simply
 * being "note".
 */
function Note(){
	this.type = "note";

	RepositoryItem.call(this);
}
Note.prototype = Object.create(RepositoryItem.prototype);
Note.constructor = Note;
Note.prototype.makeNote = function(object){
	var temp = _.extend({
		id: "A problem occured while converting to a note", // The id and content are the only two required properties other than making sure that the type is
		content: "",										// properly set to "note".  This should be made a lot smarter (maybe some common parser type thing?)
	}, object);
	temp.type = "note";
	return temp;
};

window.chandler = {
	input: null,
	notesElement: null,
	notes: null,
	carousel: null,
	inputHandler: function(e){
		if(e.key == "Enter"){
			var newNote = new Note();
			newNote.content = this.input.value;
			newNote.save();
			this.updateNotes();
			this.input.value = "";
		}
	},
	initialize: function(){
		calendar.initialize();

		this.input = document.getElementById("notes-input");
		this.notesElement = document.getElementById("notes-display");
		this.notes = new Collection("FilterGetWhereTypeIs", ["note"]); // FilterGetWhereTypeIs only takes one argument ("note") which is the type we are keeping.
		this.updateNotes();
		this.input.addEventListener('keydown', this.inputHandler.bind(this));

		this.setupCarousel();
	},
	updateNotes: function(){
		this.notes.update();
		this.notesElement.innerHTML = "";
		this.notes.items.forEach(function(item, index, array){
			var element = document.createElement("div");
			element.className = "notes-note";
			element.innerHTML = item.content +
			" <a href=\"javascript:chandler.deleteObject('" + item.id + "')\">delete</a>" +
			" <a href=\"javascript:chandler.makeEvent('" + item.id + "')\">make event</a>";
			this.notesElement.appendChild(element);
		}, this);
	},
	deleteObject: function(id){
		var noteToDelete = new Note();
		noteToDelete.id = id;
		noteToDelete.destroy();
		chandler.updateNotes();
	},
	makeEvent: function(id){
		var noteToMakeEvent = new Note();
		noteToMakeEvent.id = id;
		noteToMakeEvent.fetch();

		calendar.dialogs.createEvent(noteToMakeEvent);

		//calendar.renderCalendar(); // We shouldn't need this any more, the calendar has a view
	},
	// This is for the primary navigation and the carousel
	setupCarousel: function(){
		this.carousel = document.getElementById("carousel");
		var maybeLinks = document.getElementById("primary-navigation").children;
		var links = new Array();
		for(var i = 0; i < maybeLinks.length; ++i){
			var child = maybeLinks.item(i);
			if(child.tagName == "a" || child.tagName == "A"){
				links.push(child);
			}
		}
		links.forEach(function(item, index, array){
			item.addEventListener("click", this.setCarousel.bind(this));
		}, this);
	},
	setCarousel: function(e){
		var newClassName = e.target.innerHTML;
		this.carousel.className = newClassName;
	},
};
setTimeout(chandler.initialize.bind(chandler), 500);

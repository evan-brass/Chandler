'use strict';
/**
 * Notes are simple objects (they are usually stamped into other objects) with only two common attributes: content and type, type simply
 * being "note".
 */
function Note(){
	this.type = "note";
	this.content = "";
	RepositoryItem.call(this);
}
Note.prototype = Object.create(RepositoryItem.prototype);
Note.constructor = Note;
typeManager.registerType("Note", Note, {type: "note", content: ""});

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
		//calendar.initialize();

		this.input = document.getElementById("notes-input");
		this.notesElement = document.getElementById("notes-display");
		this.notes = new Collection("FilterGetWhereTypeIs", ["note"]); // FilterGetWhereTypeIs only takes one argument ("note") which is the type we are keeping.
		this.notes.on('change', this.updateNotes.bind(this));
		this.notes.update();
		this.input.addEventListener('keydown', this.inputHandler.bind(this));
	},
	updateNotes: function(){
		this.notesElement.innerHTML = "";
		this.notes.items.forEach(function(item, index, array){
			var element = document.createElement("div");
			element.className = "notes-note";
			element.innerHTML = item.content +
			" <a href=\"javascript:chandler.deleteObject('" + item.id + "')\">delete</a>" +
			"";
			this.notesElement.appendChild(element);
		}, this);
	},
	deleteObject: function(id){
		var noteToDelete = new RepositoryItem();
		noteToDelete.id = id;
		noteToDelete.fetch();
		noteToDelete.destroy();
	},
	makeEvent: function(id){
		var noteToMakeEvent = new Note();
		noteToMakeEvent.id = id;
		noteToMakeEvent.fetch();

		calendar.dialogs.createEvent(noteToMakeEvent);

		//calendar.renderCalendar(); // We shouldn't need this any more, the calendar has a view
	},
};
setTimeout(chandler.initialize.bind(chandler), 500);

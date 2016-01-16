'use strict';
/**
 * The type manager makes sure that repository items are turned into their appropriate objects.  It is also useful for stamping because it
 * allows you to register converters between items.  For example, as the creator of the Playlist type you can decide how a note is converted
 * into a playlist and vice versa.  This becomes more useful for things like calendar events, emails and other PIM types.
 *
 * Better yet, this has the potential to allow easy upgrading of repository items.  For example: Playlist version 1.0 had no description
 * attribute.  You could rename the old Playlist Playlist-v1.0 and register your new type as Playlist with a converter for Playlist-v1.0
 * to Playlist.  Now you would just need to have an upgrade dialog that converts all of the Playlist-v1.0s to Playlists.  This has complications
 * with sharing but at this point, I don't care.
 *
 * As for checking if a object is of a type, it must have all of the attributes names that are on the sample.  This means that your sample should have all
 * of the attribute names that it would have straight from the repository, no more.
 *
 * The TypeManager is really only for types that are saved to the repository.
 */
function TypeManager(){
	this.types = {}; // This stores the type templates.
	this.converters = {};
}
TypeManager.prototype = {};
TypeManager.constructor = TypeManager;

TypeManager.prototype.registerType = function(typename, constructor, sample){
	if(this.types[typename]){
		var er = new Error("TypeManager: This type has already been registered.  It must be unregistered before reregistration.");
		console.log(er);
		return er;
	}
	this.types[typename] = {"typename": typename, "constructor": constructor, "sample": sample};
};

TypeManager.prototype.unregisterType = function(typename){
	delete this.types[typename];
};

TypeManager.prototype.registerConverter = function(fromType, toType, func){
	if(this.constructors[fromType + "-" + toType]){
		var er = new Error("TypeManager: These types already have a converter.");
		console.log(er);
		return er;
	} else {
		this.converters[fromType + "-" + toType] = func;
	}
};

TypeManager.prototype.unregisterConverter = function(fromType, toType){
	delete this.converters[fromtType + "-" + toType];
};

TypeManager.prototype.whatIs = function(object){
	var wereGood = false;
	for (var typeName in this.types){
		var type = this.types[typeName];
		for(var key in type.sample){
			if(typeof object[key] !== "undefined"){
				wereGood = true;
			} else {
				wereGood = false;
				break;
			}
		} // All keys are present
		if(wereGood){
			return typeName;
		}
	}
	var er = new Error("TypeManager: An object that doesn't fit any registered type has been found!");
	console.log(er);
	console.log(object);
	return er;
};

TypeManager.prototype.convert = function(object, newType){
	newType = newType || this.whatIs(object);
	var objType = this.whatIs(object);
	if(this.converters[objType + "-" + newType]){
		return this.converters[objType + "-" + newType](object);
	} else { // Default conversion
		var temp = new this.types[newType].constructor();
		_.extend(temp, object);
		return temp;
	}
};

TypeManager.prototype.parse = function(object){
	return this.convert(object); // Help our object find it's true calling
};

TypeManager.prototype.isA = function(object, type){
	return (this.whatIs(object) == type);
};

// Create the only needed typeManager. (similiar to the only really needed repository)
window.typeManager = new TypeManager();

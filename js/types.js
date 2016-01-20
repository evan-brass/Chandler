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
 * As for checking if an object is of a type, it must have all of the attributes names that are on the sample.  Additionally, any attributes on
 * the sample that aren't equal to false will require that the object being tested have those values.  A use for this is sample.type = "note" or
 * something.  This means that your sample should have all of the attribute names that it would have straight from the repository, no more.
 *
 * The TypeManager is really only for types that are saved to the repository.
 */
function TypeManager() {
	// This stores the type templates.  It is an array so that we can sort it.
	// It is sorted so that the objects with the most attributes on their sample, the most complex, are tested first.
	// This prevents, for example, a to-do item from being turned into a note because a to-do item has all of the properties of a note, etc.
	this.types = [];
	// Converters can be an object because there is no sorting needed.
	this.converters = {};
}

TypeManager.prototype = {};
TypeManager.constructor = TypeManager;

TypeManager.prototype.registerType = function(typename, constructor, sample) {
	if (this.types.indexOf(this.getType(typename)) != -1) {
		var er = new Error("TypeManager: This type has already been registered.  It must be unregistered before reregistration.");
		console.warn(er);
		return er;
	}
	this.types.push({
		"typename" : typename,
		"constructor" : constructor,
		"sample" : sample
	});
	this.types.sort(function(a, b) {
		if (Object.keys(a.sample).length > Object.keys(b.sample).length) {
			return -1;
		} else if (Object.keys(a.sample).length < Object.keys(b.sample).length) {
			return 1;
		} else {
			return 0;
		}
	});
};

TypeManager.prototype.unregisterType = function(typename) {
	this.types.splice(this.types.indexOf(this.getType(typename)), 1);
};

TypeManager.prototype.registerConverter = function(fromType, toType, func) {
	if (this.constructors[fromType + "-" + toType]) {
		var er = new Error("TypeManager: There is already a converter from: " + fromType + " to " + toType);
		console.warn(er);
		return er;
	} else {
		this.converters[fromType + "-" + toType] = func;
	}
};

TypeManager.prototype.unregisterConverter = function(fromType, toType) {
	delete this.converters[fromtType + "-" + toType];
};

TypeManager.prototype.whatIs = function(object) {
	var wereGood = true;
	for (var i = 0; i < this.types.length; ++i) {
		// wereGood until were not.
		wereGood = true;
		var typeName = this.types[i].typename;
		var type = this.getType(typeName);
		for (var key in type.sample) {
			if ( typeof object[key] !== "undefined") {
				if (type.sample[key] == false) {
					wereGood = true;
				} else if (object[key] == type.sample[key]) {
					wereGood = true;
				} else {
					wereGood = false;
				}
			} else {
				wereGood = false;
				break;
			}
		}// All keys are present
		if (wereGood) {
			return typeName;
		} else {
			// Unknown is an actual type registered by the typeManager.  It just doesn't do anything.
			return "unknown";
		}
	}
	var er = new Error("TypeManager: An object that doesn't fit any registered type has been found!");
	console.warn(er);
	return "unknown";
	// Use the unknown type.
};

TypeManager.prototype.getType = function(typeName) {
	for (var i = 0; i < this.types.length; ++i) {
		if (this.types[i].typename == typeName) {
			return this.types[i];
		}
	}
	return {};
};

TypeManager.prototype.convert = function(object, newType) {
	var objType = this.whatIs(object);
	if (this.converters[objType + "-" + newType]) {
		return this.converters[objType + "-" + newType](object);
	} else {// Default conversion
		var temp = new ((this.getType(newType)).constructor)();
		_.extend(temp, object);
		return temp;
	}
};

TypeManager.prototype.parse = function(object) {
	// Help our object find it's true calling
	return this.convert(object, this.whatIs(object));
};

TypeManager.prototype.isA = function(object, type) {
	return (this.whatIs(object) == type);
};

// Create the only needed typeManager. (similiar to the only really needed repository)
window.typeManager = new TypeManager();

// The unknown type
function UnknownType() {
	this.type = "unknown";
}

UnknownType.prototype = {};
UnknownType.constructor = UnknownType;
typeManager.registerType("unknown", UnknownType, {});

/**
 * The styles that are associated with this widget are in: src/css/ui/widgets/toggle-switch.css
 */

window.Widgets = window.Widgets || {}; // Maker sure that out namespace is defined

// ToggleSwitch is a simple checkbox form element that looks like a toggle switch
Widgets.ToggleSwitch = function(title, id) {
	this.id = id || 'No-Id';
	title = title || '';
	this.element = document.createElement('span');
	this.element.classList.add('toggle-switch');
	
	this.checkbox = document.createElement('input');
	this.checkbox.type = 'checkbox';
	this.checkbox.id = this.id;
	
	this.label = document.createElement('label');
	this.label.innerHTML = title;
	this.label.setAttribute('for', this.id);
	
	this.element.appendChild(this.checkbox);
	this.element.appendChild(this.label);
};
Widgets.ToggleSwitch.prototype = Object.create(Widgets.Generic);
'use strict';

// This is used for callbacks and some other stuff
function TaskManager(){

}
TaskManager.prototype.createTask = function(){
	window.sampleDialog = userinterface.windows.dialog("" +
	"<span style='width: 100px; display: inline-block; text-align: left;'>Description: </span>" +
	"<input type='text' name='description' style='width: 200px; display: inline-block;'><br>" +
	"<span style='width: 100px; display: inline-block; text-align: left;'>Due Date: </span>" +
	"<input type='date' name='date' style='width: 200px; display: inline-block;' placeholder='yyyy-mm-dd'>" +
	"", "Create Task:", "done cancel", function(element){
		var description = element.querySelector("input[name='description']");
		var date = element.querySelector("input[name='date']");
		var dueDate = new Date(date.value);
		var error = false;
		if(description.value && dueDate){
			var newTask = new Task();
			newTask.description = description.value;
			newTask.due = dueDate;
			newTask.save();
			return true;
		} else {
			var error = element.querySelector('span.error') || document.createElement('span');
			error.className = "error";
			error.innerHTML = "Bad input.";
			error.style.color = 'red';
			element.insertBefore(error, element.querySelector('.message'));
		}
	});
};
TaskManager.prototype.completeTask = function(id){
	var taskToComplete = new Task();
	taskToComplete.id = id;
	taskToComplete.fetch();
	taskToComplete.complete();
	taskToComplete.save();
};
window.taskmanager = new TaskManager();

// The Task repository item
function Task(){
	RepositoryItem.call(this);
	this.type = "task";
	this.due = new Date();
	this.description = "";
	this.status = "Not Started"; // One of: ["Not Started", "In Progress", "Complete"]
}
Task.prototype = Object.create(RepositoryItem.prototype);
Task.constructor = Task;
Task.prototype.complete = function(){
	this.status = "Complete";
};
typeManager.registerType("Task", Task, {type: "task"});

// The task view
function TaskView() {
	if (!TaskView.prototype.TaskViewStylesLoaded) {
		TaskView.prototype.loadTaskViewStyles();
	}
	View.call(this);

	this.taskList = new Collection("FilterGetWhereTypeIs", ["task"]);
	this.taskList.on('change', this.render.bind(this));
	this.element.className += " task-view";
	this.taskList.update();
}

TaskView.prototype = Object.create(View.prototype);
TaskView.constructor = TaskView;

TaskView.prototype.render = function() {
	var content = "";
	content += "<h2>Tasks</h2>";
	content += "<a href='javascript: taskmanager.createTask();'>Create a task</a>";
	content += "<table><thead>";
	content += "<tr><td>Description</td><td>Status</td><td>Due</td><td>Actions</td></tr>";
	content += "</thead><tbody>";
	if(this.taskList.items.length > 0){
		for (var i = 0; i < this.taskList.items.length; ++i){
			var task = this.taskList.items[i];
			content += "<tr><td>" + task.description + "</td><td>" + task.status + "</td><td>" + task.due + "</td><td>" +
			"<a href=\"javascript: taskmanager.completeTask('" + task.id + "');\">Complete</a></td></tr>";
		}
	} else {
		content += "<tr><td colspan='4' style='text-align: center;'>You have no tasks at this time.  You can create one using the button above.</td></tr>";
	}

	content += "</tbody></table>";
	this.element.innerHTML = content;
};

TaskView.prototype.loadTaskViewStyles = function() {
	var styles = {
		"TaskView" : ".task-view{" +
			"}" +
			".task-view table{" +
				"width: 100%;" +
				"border-collapse: collapse" +
			"}" +
			".task-view td{" +
				"padding: 5px;" +
				"border: 1px solid #aaa;" +
			"}" +
			".task-view thead{" +
				"background-color: #eee;" +
			"}" +
			".task-view tbody{" +
				"max-height: 600px;" +
				"overflow-y: auto;" +
			"}",
	};
	for (var handle in styles) {
		userinterface.styler.addStyle(handle, styles[handle]);
	}
	TaskView.prototype.TaskViewStylesLoaded = true;
};

TaskView.prototype.deleteTask = function(id){
	userinterface.windows.dialog("Are you sure that you wan't to delete this task?", false, "yes no").then(function(id, val){
		if(val == "ok" || val == "Ok"){
			var itemToDelete = new RepositoryItem();
			itemToDelete.id = id;
			itemToDelete.fetch();
			itemToDelete.destroy();
		}
	}.bind(this, id));
};

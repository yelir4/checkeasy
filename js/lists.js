console.log("lists.js loaded ...");

/** document selectors */
var newListButton = document.getElementById("newListButton");
var sections = document.querySelectorAll("section");

/** global variables */
var currentSection = 0;

/** new event listener for `newListButton` creates new todo list */
newListButton.addEventListener("click", function ()
{
	/** hide newListButton */
	this.remove();

	/** create new todo list */
	const newList = document.createElement("figure");

	/** list title input */
	const input = document.createElement("input");
	input.type = "text";
	input.placeholder = "list name...";

	newList.append(input);

	const section = sections[(currentSection++ % 3)];
	section.append(newList);

	input.focus();

	/** Set proper ID */
	fetch("../php/getNextListID.php")
		.then(res => res.json())
		.then(data => {
			newList.id = data.id;
		});

	/** add event listener for text input */
	input.addEventListener("keypress", function(event)
	{
		/** if enter key pressed */
		if (event.keyCode === 13)
		{
			/** extract value from input box, sanitize */
			let value = input.value.replace(/[^a-zA-Z0-9 ]/g, '');

			/** remove the text box */
			this.remove();

			/** create list title */
			const listTitle = document.createElement("h1");
			listTitle.innerHTML = value;

			newList.append(listTitle);

			/** move newListButton */
			newListButton.remove();
			sections[currentSection % 3].append(newListButton);

			const ownerP = document.createElement("p");
			ownerP.setAttribute("id", "ownerP");
			ownerP.innerHTML = "Owner: test@gmail.com";

			/** ul list */
			const tasks = document.createElement("ul");

			const addTaskDiv = document.createElement("div");
			const addTaskButton = document.createElement("p");
			addTaskButton.setAttribute("id", "addTaskButton");
			addTaskButton.innerHTML = "add task";
			addTaskButton.addEventListener("click", addTask);

			const manageButton = document.createElement("p");
			manageButton.setAttribute("id", "manageButton");
			manageButton.innerHTML = "Manage";

			/** structure */
			newList.append(listTitle);
			newList.append(ownerP);
			newList.append(tasks);
			addTaskDiv.append(addTaskButton);
			newList.append(addTaskDiv);
			newList.append(manageButton);

			// Send new list data to server
			const listId = newList.id;
			console.log(listId);

			const dataToSend = JSON.stringify({
				type: "createList",
				listName: value,
				listId: newList.id
			});

			sendData(dataToSend);
		}
	});
});

/** add task to given list */
function addTask ()
{
	const addTaskButton = this;
	const addTaskDiv = this.parentElement;
	const tasks = addTaskDiv.parentElement.querySelector("ul");
	this.remove();

	const input = document.createElement("input");
	input.type = "text";
	input.name = "input";
	input.placeholder = "...";

	/** add event listener for input */
	input.addEventListener("keypress", function(event)
	{
		if (event.keyCode === 13)
		{
			const projectId = addTaskDiv.parentElement.id;

			/** extract value from input box, sanitize */
			let value = input.value.replace(/[^a-zA-Z0-9 ]/g, '');

			/** remove the text box */
			this.remove();

			const task = document.createElement("li");
			task.innerHTML = value;
			task.classList.add("unfinished");
			task.addEventListener("click", () => {
				toggleFinished(task);
				toggleTaskOnBackend(projectId, value);
			});

			addTaskDiv.append(addTaskButton);
			tasks.append(task);

			addTaskToBackendList(projectId, value);
		}
	});

	/** add our new input */
	tasks.append(input);

	/** draw focus so user can type */
	input.focus();
}

function enterTask (input)
{
	console.log(this.text);
	this.remove();
}

/** toggle a given task finished */
function toggleFinished(element)
{
	element.classList.toggle("finished");
}

const addTaskToBackendList = (id, task) => {
	const dataToSend = JSON.stringify({
		type: "addTask",
		listId: id,
		task: task
	});

	sendData(dataToSend);
}

const toggleTaskOnBackend = (id, task) => {
	const dataToSend = JSON.stringify({
		type: "toggleTask",
		listId: id,
		task: task
	});

	sendData(dataToSend);
}

const sendData = (dataToSend) => {
	const xhr = new XMLHttpRequest();

	xhr.open('POST', "../php/dataTransfer.php", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onload = function() {
		if (xhr.status >= 200 && xhr.status < 300) {
			console.log('Data sent successfully.');
			// Handle the response from the PHP script if needed
		} else {
			console.error('Request failed with status:', xhr.status);
		}
	};
	xhr.send(dataToSend);
}
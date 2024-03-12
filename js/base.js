console.log("base.js loaded ...");

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
			/** extract value from input box, sanitize */
			let value = input.value.replace(/[^a-zA-Z0-9 ]/g, '');

			/** remove the text box */
			this.remove();

			const task = document.createElement("li");
			task.innerHTML = value;
			task.classList.add("unfinished");
			task.addEventListener("click", toggleFinished);

			addTaskDiv.append(addTaskButton);
			tasks.append(task);
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
function toggleFinished ()
{
	this.classList.toggle("finished");
}

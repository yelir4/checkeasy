console.log("base.js loaded ...");

/** document selectors */
var newListButton = document.getElementById("newListButton");
var sections = document.querySelectorAll("section");

/** global variables */
var currentSection = 0;

/** new event listener for `newListButton */
newListButton.addEventListener("click", function ()
{
	const newList = document.createElement("figure");
	const listTitle = document.createElement("h1");
	listTitle.innerHTML = "New list";

	const tasks = document.createElement("ul");

	const task = document.createElement("li");
	task.innerHTML = "i like ice creamc";

	const addTask = document.createElement("p");
	addTask.setAttribute("id", "addTask");
	addTask.innerHTML = "add task";

	const manageButton = document.createElement("p");
	manageButton.setAttribute("id", "manageButton");
	manageButton.innerHTML = "Manage";

	/** structure */
	newList.append(listTitle);
	tasks.append(task);
	newList.append(task);
	newList.append(addTask);
	newList.append(manageButton);

	const section = sections[(currentSection++ % 3)];
	section.append(newList);
	console.log(typeof(section));

	/** move newListButton */
	newListButton.remove();
	sections[currentSection % 3].append(newListButton);
});

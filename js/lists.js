/** document selectors */
let newListButton = document.getElementById("newListButton");
let sections = document.querySelectorAll("section");

/** global variables */
let currentSection = 0;

/** Add functionality to logout button */
const logoutButton = document.getElementById("logout");
logoutButton.addEventListener("click", () => {
	window.location.href="../php/index.php?page=logout";
});

/** Async functionality for when page loads */
async function onLoad() {
	/** Append preexisting lists */
	const lists = await getUserLists();
	const currentUser = await getCurrentUser();
	lists.forEach((list) => {
		createList(list, currentUser)
	});

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
		input.addEventListener("keypress", async function(event)
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
				/** Get current user from backend */
				ownerP.innerHTML = `Owner ${await getCurrentUser()}`

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
				manageButton.addEventListener("click", () => {
					manageList(newList.id);
				});

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
}

/** Begin onload function */
onLoad();

/** Create new list element */
async function createList(data, currentUser) {
	const newList = document.createElement("figure");
	newList.id = data.id;

	/** create list title */
	const listTitle = document.createElement("h1");
	listTitle.innerHTML = data.name;

	/** move newListButton */
	newListButton.remove();
	const section = sections[(currentSection++ % 3)];
	section.append(newList);
	sections[currentSection % 3].append(newListButton);

	/** set author */
	const ownerP = document.createElement("p");
	ownerP.setAttribute("id", "ownerP");
	ownerP.innerHTML = `Owner: ${data.creator}`;

	/** ul list */
	const tasks = document.createElement("ul");

	const addTaskDiv = document.createElement("div");
	const addTaskButton = document.createElement("p");
	addTaskButton.setAttribute("id", "addTaskButton");
	addTaskButton.innerHTML = "Add Task";
	addTaskButton.addEventListener("click", addTask);

	const manageButton = document.createElement("p");
	manageButton.setAttribute("id", "manageButton");
	manageButton.innerHTML = "Manage";
	manageButton.addEventListener("click", () => {
		manageList(newList.id);
	});

	/** append existing tasks */
	for await (const [key, isComplete] of Object.entries(data.items)) {
		const task = document.createElement("li");
		task.innerHTML = key;
		task.classList.add("unfinished");
		if (isComplete) task.classList.add("finished");
		task.addEventListener("click", () => {
			toggleFinished(task);
			toggleTaskOnBackend(data.id, key);
		});

		tasks.append(task);
	}

	/** structure */
	newList.append(listTitle);
	newList.append(ownerP);
	newList.append(tasks);
	addTaskDiv.append(addTaskButton);
	newList.append(addTaskDiv);
	if (data.creator === currentUser) newList.append(manageButton);
}

/** add task to given list */
function addTask ()
{
	const addTaskButton = this;
	const addTaskDiv = this.parentElement;
	const tasks = addTaskDiv.parentElement.querySelector("ul");
	this.remove();

	const input = document.createElement("input");
	input.classList.add("taskinput");
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

const manageList = (id) => {
	window.location.href = `./index.php?page=manage&id=${id}`;
}
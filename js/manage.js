const addTask = (addTaskButton, id) => {
    const addTaskDiv = addTaskButton.parentElement;
    const tasks = addTaskDiv.parentElement.querySelector("ul");
    addTaskButton.remove();

    const input = document.createElement("input");
    input.type = "text";
    input.name = "input";
    input.placeholder = "...";

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
            task.addEventListener("click", () => {
                toggleFinished(task);
                toggleTaskOnBackend(id, value);
            });

            addTaskDiv.append(addTaskButton);
            tasks.append(task);

            addTaskToBackendList(id, value);
        }
    });

    tasks.append(input);

    input.focus();
}

const appendContent = async (id) => {
    const data = await getListData(id);
    const user = await getCurrentUser();

    // Only allow access if a user is owner
    if (data.creator !== user) {
        window.location.href = "./lists.php";
        return;
    }

    /** LIST CONTENT APPEND */
    const listContainer = document.getElementById("listcontainer");

    // List title element
    const listTitle = document.createElement("h1");
    listTitle.textContent = data.name;

    // List owner display element
    const ownerP = document.createElement("p");
    ownerP.setAttribute("id", "ownerP");
    ownerP.innerHTML = `Owner: ${data.creator}`;

    // List tasks display
    const tasks = document.createElement("ul");
    const addTaskDiv = document.createElement("div");
    const addTaskButton = document.createElement("p");
    addTaskButton.innerHTML = "Add Task";
    addTaskButton.addEventListener("click", () => {
        addTask(addTaskButton, id);
    });

    // Append existing tasks
    for (const [key, isComplete] of Object.entries(data.items)) {
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

    // Structure
    listContainer.append(listTitle);
    listContainer.append(ownerP);
    listContainer.append(tasks);
    addTaskDiv.append(addTaskButton);
    listContainer.append(addTaskDiv);


    /** SHARE APPEND */
    const shareContainer = document.getElementById("sharecontainer");

    data.members.forEach((member) => {
        if (member !== user) {
            const memberDisplay = document.createElement("p");
            memberDisplay.textContent = member;
            memberDisplay.addEventListener("click", async () => {
                await removeMember(member, data.id);
                memberDisplay.remove();
            });

            shareContainer.append(memberDisplay);
        }
    });
}

// Get proper list from URL params
const searchParams = new URLSearchParams(window.location.search);
let listId = null;
if (searchParams.has("id")) {
    listId = searchParams.get("id");
    appendContent(listId);
}
/**
 * Use this function to get a JSON object of a list based on ID
 * @param id The id of the list to fetch
 * @returns {Promise<void>} JSON object
 */
const getListData = async (id) => {
    const res = await fetch("../php/getLists.php");
    const data = await res.json();
    return data.lists.find((list) => {
        return list.id === id;
    });
}

const getCurrentUser = async () => {
    const res = await fetch("../php/getCurrentUser.php");
    const data = await res.json();
    return data.user;
}

const removeMember = async (member, id) => {
    const dataToSend = JSON.stringify({
        type: "removeMember",
        listId: id,
        member: member
    });

    sendData(dataToSend);
}

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
            const memberDiv = document.createElement("div");

            const deleteMemberButton = document.createElement("p");
            deleteMemberButton.textContent = "x";
            deleteMemberButton.addEventListener("click", async () => {
                await removeMember(member, data.id);
                memberDiv.remove();
            });

            const memberDisplay = document.createElement("p");
            memberDisplay.textContent = member;

            memberDiv.appendChild(deleteMemberButton);
            memberDiv.appendChild(memberDisplay);
            shareContainer.append(memberDiv);
        }
    });
}

// Get proper list
const searchParams = new URLSearchParams(window.location.search);
let listId = null;
if (searchParams.has("id")) {
    listId = searchParams.get("id");
    appendContent(listId);
}
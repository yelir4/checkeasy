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
        window.location.href = "./index.php?page=lists";
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
    addTaskDiv.id = "addtaskbutton";
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
    const userContainer = document.getElementById("shareusers");
    const addUserContainer = document.getElementById("addusers");

    const addUserButton = document.createElement("p");
    const newUserInput = document.createElement("input");

    data.members.forEach((member) => {
        if (member !== user) {
            const memberDisplay = document.createElement("p");
            memberDisplay.textContent = member;
            memberDisplay.addEventListener("click", async () => {
                await removeMember(member, data.id);
                memberDisplay.remove();
                const shareStatus = document.getElementById("sharestatus");
                shareStatus.textContent = "User successfully removed!";
                shareStatus.setAttribute("style", "color: green");
            });

            userContainer.append(memberDisplay);
        }
    });

    // Button to share with more users
    addUserButton.id = "adduser";
    addUserButton.textContent = "Share";
    addUserContainer.append(addUserButton);
    addUserButton.addEventListener("click", async () => {
        newUserInput.setAttribute("style", "display:block");
        addUserButton.setAttribute("style", "display:none");
    });
    addUserContainer.append(addUserButton);

    // New user input
    newUserInput.id = "newuserinput";
    newUserInput.placeholder = "New User...";
    // Hidden by default
    newUserInput.setAttribute("style", "display:none");
    newUserInput.addEventListener("keypress", async (event) => {
       if (event.keyCode === 13) {
           // Constants
           const toAdd = newUserInput.value;
           const allUsers = await getAllUsers();
           console.log(allUsers);
           const shareStatus = document.getElementById("sharestatus");

           // Only add new user if they exist
           if (!allUsers.includes(toAdd)) {
               shareStatus.textContent = "User does not exist!";
               shareStatus.setAttribute("style", "color: red");
               return;
           } else if (toAdd === data.creator) {
               shareStatus.textContent = "You are already a part of your own list!"
               shareStatus.setAttribute("style", "color: red");
           }

           // Add to member list
           await addMember(toAdd, data.id);
           const memberDisplay = document.createElement("p");
           memberDisplay.textContent = toAdd;
           memberDisplay.addEventListener("click", async () => {
               await removeMember(member, data.id);
               memberDisplay.remove();
           });

           userContainer.append(memberDisplay);

           // Update display
           newUserInput.setAttribute("style", "display:none");
           addUserButton.setAttribute("style", "display:block");
           shareStatus.textContent = "User successfully added!";
           shareStatus.setAttribute("style", "color:green");
       }
    });
    addUserContainer.append(newUserInput);

    const shareStatus = document.createElement("p");
    shareStatus.id = "sharestatus";
    shareContainer.append(shareStatus);
}

// Get proper list from URL params
const searchParams = new URLSearchParams(window.location.search);
let listId = null;
if (searchParams.has("id")) {
    listId = searchParams.get("id");
    appendContent(listId);
}
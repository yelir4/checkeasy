/**
 * Toggles the visual state of a list item when clicked
 * @param element Element of list item to toggle
 */
function toggleFinished(element)
{
    element.classList.toggle("finished");
}

/**
 * Adds a task to a given list in the JSON
 * @param id ID of project to update
 * @param task Name of task to add
 */
const addTaskToBackendList = (id, task) => {
    const dataToSend = JSON.stringify({
        type: "addTask",
        listId: id,
        task: task
    });

    sendData(dataToSend);
}

/**
 * Toggles the boolean value of a variable in JSON
 * @param id ID of project to update
 * @param task Name of task to toggle
 */
const toggleTaskOnBackend = (id, task) => {
    const dataToSend = JSON.stringify({
        type: "toggleTask",
        listId: id,
        task: task
    });

    sendData(dataToSend);
}

/**
 * Returns an array of all lists that pertain to a user
 * @returns {Promise<*>} User lists, whether those be created or shared to the user
 */
const getUserLists = async () => {
    const res = await fetch("../php/getLists.php");
    const data = await res.json();
    return data.lists;
}

/**
 * Use this function to get a JSON object of a list based on ID
 * @param id The id of the list to fetch
 * @returns {Object} List data object
 */
const getListData = async (id) => {
    const res = await fetch("../php/getLists.php");
    const data = await res.json();
    return data.lists.find((list) => {
        return list.id === id;
    });
}

/**
 * Use this function to get the current active user of the webpage
 * @returns {Object} User data object
 */
const getCurrentUser = async () => {
    const res = await fetch("../php/getCurrentUser.php");
    const data = await res.json();
    return data.user;
}

/**
 * Removes a user from accessing a list
 * @param member User email to remove
 * @param id ID of project to remove them from
 */
const removeMember = async (member, id) => {
    const dataToSend = JSON.stringify({
        type: "removeMember",
        listId: id,
        member: member
    });

    sendData(dataToSend);
}

/**
 * Sends information to php backend to update data
 * @param {Object}dataToSend Object containing data to send to backend
 */
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
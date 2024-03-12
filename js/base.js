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

// Handle fail param
const params = new URLSearchParams(window.location.search);
if (params.has("fail")) {
    const fail = params.get("fail");
    const status = document.createElement("p");
    status.setAttribute("style", "color: red;");

    const statusContainer = document.querySelector("form");
    statusContainer.appendChild(status);

    if (fail === "MISSING_DATA") {
        status.textContent = "Missing Fields";
    } else if (fail === "INCORRECT_PASSWORD") {
        status.textContent = "Incorrect Password";
    } else if (fail === "USER_EXISTS") {
        status.textContent = "User Already Exists";
    } else if (fail === "NO_SUCH_USER") {
        status.textContent = "No Such User Exists";
    }
}

// Create button functions
const loginButton = document.querySelector(".button.login-btn");
const registerButton = document.querySelector(".button.register-btn");
loginButton.addEventListener("click", () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    window.location.href = `../php/index.php?page=login&email=${email}&password=${password}`;
});

registerButton.addEventListener("click", () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    window.location.href = `../php/index.php?page=register&email=${email}&password=${password}`;
});
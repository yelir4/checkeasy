<?php
header("Content-Type: text/html");
libxml_use_internal_errors(true);

// Global dict to store all pages a user can go to. Should point to a function on how to handle page load
$pages = array(
    "home"=>"onHomeLoad",
    "lists"=>"onListsLoad",
    "login"=>"onLoginLoad",
);

// Get page type to load <-- Every page will route back here
$page = null;
if (isset($_GET["page"])) {
    global $page;
    $page = $_GET["page"];
    $pages[$page]();
} else { // Default to home if no page provided to index.php
    $pages["home"]();
}

/**
 * Redirects to home.php to display webpage contents
 * @return void Ignore
 */
function onHomeLoad() {
    header("Location: home.php");
}

function onListsLoad() {
    header("Location: lists.php");
}

function onLoginLoad() {
    // Get email and password
    $email = null;
    $password = null;

    // Get information from given URL params
    if (isset($_GET["email"])) {
        $email = $_GET["email"];
    } else {
        echo "Improper login attempt. Must include email and password params in URL";
    }

    if (isset($_GET["password"])) {
        $password = $_GET["password"];
    } else {
        echo "Improper login attempt. Must include email and password params in URL";
    }

    // Get user data to store to session
    $userDataFile = "../data/users.json";

    if (file_exists($userDataFile)) {
        $userData = json_decode(file_get_contents($userDataFile), true);
        if ($userData[$_GET["email"]]["password"] !== $_GET["password"]) {
            echo "Invalid user";
            return;
        }
    }

    // Creates a new php session with proper user information to be accessed by all other pages
    session_start();

    // Add proper user information to session
    $_SESSION["userInfo"] = $userData[$_GET["email"]];

    echo var_dump($_SESSION["userInfo"]);

    // Redirect to lists page
    onListsLoad();
}
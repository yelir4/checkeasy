<?php
ini_set('session.cookie_secure', '0');
session_start();
header("Content-Type: text/html");
libxml_use_internal_errors(true);

// Global dict to store all pages a user can go to. Should point to a function on how to handle page load
$pages = array(
    "home"=>"onHomeLoad",
    "lists"=>"onListsLoad",
    "login"=>"onLoginLoad",
    "register"=>"onRegisterLoad",
    "logout"=>"onLogoutLoad",
    "manage"=>"onManageLoad"
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
    if (isset($_SESSION["userInfo"])) {
        header("Location: lists.php");
        return;
    }
    header("Location: home.php");
}

function onListsLoad() {
    header("Location: lists.php");
}

/**
 * Creates a user session when linking to the "login" page
 * Must provide "email" and "password" URL parameters
 * @return void Ignore
 */
function onLoginLoad() {
    // Get email and password
    $email = null;
    $password = null;

    // Get information from given URL params
    if (isset($_GET["email"])) {
        $email = $_GET["email"];
    } else {
        header("Location: home.php?fail=MISSING_DATA");
        return;
    }

    if (isset($_GET["password"])) {
        $password = $_GET["password"];
    } else {
        header("Location: home.php?fail=MISSING_DATA");
        return;
    }

    if (strlen($email) < 1 || strlen($password) < 1) {
        header("Location: home.php?fail=MISSING_DATA");
        return;
    }

    // Get user data to store to session
    $userDataFile = "../data/users.json";

    if (file_exists($userDataFile)) {
        $userData = json_decode(file_get_contents($userDataFile), true);
        if (!array_key_exists($email, $userData)) { // User doesn't exist
            header("Location: home.php?fail=NO_SUCH_USER");
            return;
        }

        if ($userData[$email]["password"] !== $password) {
            header("Location: home.php?fail=INCORRECT_PASSWORD");
            return;
        }
    } else {
        return;
    }

    // Creates a new php session with proper user information to be accessed by all other pages
    session_start();

    // Add proper user information to session
    $_SESSION["userInfo"] = $userData[$email];

    // Redirect to lists page
    onListsLoad();
}

/**
 * Creates a new user when linking to the "register" page
 * Must provide "email" and "password" URL parameters
 * @return void Ignore
 */
function onRegisterLoad() {
    // Get email and password
    $email = null;
    $password = null;

    // Get information from given URL params
    if (isset($_GET["email"])) {
        $email = $_GET["email"];
    } else {
        header("Location: home.php?fail=MISSING_DATA");
        return;
    }

    if (isset($_GET["password"])) {
        $password = $_GET["password"];
    } else {
        header("Location: home.php?fail=MISSING_DATA");
        return;
    }

    if (strlen($email) < 1 || strlen($password) < 1) {
        header("Location: home.php?fail=MISSING_DATA");
        return;
    }

    // Get user data
    $userDataFile = "../data/users.json";

    if (file_exists($userDataFile)) {
        $userData = json_decode(file_get_contents($userDataFile), true);
        if (array_key_exists($email, $userData)) {
            header("Location: home.php?fail=USER_EXISTS");
            return;
        }

        $newUserObject = array(
            "email"=>$email,
            "password"=>$password,
            "lists"=>array()
        );

        $userData[$email] = $newUserObject;

        $updatedJson = json_encode($userData, JSON_PRETTY_PRINT);
        file_put_contents($userDataFile, $updatedJson);

        // Creates a new php session with proper user information to be accessed by all other pages

        // Add proper user information to session
        $_SESSION["userInfo"] = $userData[$email];

        // Redirect to lists page
        onListsLoad();
    }
}

function onLogoutLoad() {
    session_destroy();
    header("Location: home.php");
}

function onManageLoad() {
    $listDataFile = "../data/lists.json";
    $listData = null;

    if (file_exists($listDataFile)) {
        $listData = json_decode(file_get_contents($listDataFile), true);
    }

    if (isset($_GET["id"])) {
        if ($listData[$_GET["id"]]["creator"] === $_SESSION["userInfo"]["email"]) {
            $id = $_GET["id"];
            header("Location: manage.php?id=" . $id);
        } else {
            header("Location: lists.php");
        }
    } else {
        header("Location: lists.php");
    }
}
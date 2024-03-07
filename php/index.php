<?php
header("Content-Type: text/html");
libxml_use_internal_errors(true);

// Global dict to store all pages a user can go to. Should point to a function on how to handle page load
$pages = array(
    "home"=>onHomeLoad(),
);

// Get page type to load <-- Every page will route back here
$page = null;
if (isset($_GET["page"])) {
    global $page;
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
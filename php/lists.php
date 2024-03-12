<?php
session_start();
header("Content-Type: text/html");
libxml_use_internal_errors(true);

// TODO: Load a user's lists. Just use $_SESSION["userInfo"] to determine what to load

// Create new DOM and append the home.html content to it
$doc = new DOMDocument();
$fileName = "../html/lists.html";
// Check if file exists
if (file_exists($fileName)) {
    $doc->loadHTMLFile($fileName);
} else {
    echo "File " . $fileName . " does not exist!";
}

echo $doc->saveHTML();
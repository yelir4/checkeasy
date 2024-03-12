<?php
session_start();
header("Content-Type: text/html");
libxml_use_internal_errors(true);

// Create new DOM and append the manage.html content to it
$doc = new DOMDocument();
$fileName = "../html/manage.html";
// Check if file exists
if (file_exists($fileName)) {
    $doc->loadHTMLFile($fileName);
} else {
    echo "File " . $fileName . " does not exist!";
}

echo $doc->saveHTML();
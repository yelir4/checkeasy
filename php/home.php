<?php
header("Content-Type: text/html");
libxml_use_internal_errors(true);

// Create new DOM and append the home.html content to it
$doc = new DOMDocument();
$fileName = "../html/home.html";
// Check if file exists
if (file_exists($fileName)) {
    $doc->loadHTMLFile($fileName);
} else {
    echo "File " . $fileName . " does not exist!";
}

echo $doc->saveHTML();
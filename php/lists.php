<?php
header("Content-Type: text/html");
libxml_use_internal_errors(true);

// TODO: Load a user's lists. Just use $_SESSION["userInfo"] to determine what to load


/** load lists.html into a DOM */
$doc = new DOMDocument();
$fileName = "../html/lists.html";

/** check for the file */
if (file_exists($fileName)) {
    $doc->loadHTMLFile($fileName);
} else {
    echo "File " . $fileName . " does not exist!";
}

/** output doc to the user */
echo $doc->saveHTML();
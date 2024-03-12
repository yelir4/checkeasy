<?php
session_start();
header("Content-Type: text/html");
libxml_use_internal_errors(true);

// Get list data
$listDataFile = "../data/lists.json";
$nextId = null;
$listData = null;

if (file_exists($listDataFile)) {
    $listData = json_decode(file_get_contents($listDataFile), true);
    $nextId = array(
        "id"=>$listData["nextId"]
    );

    header("Content-Type: application/json");
    echo json_encode($nextId);

    // Update id to next one
    $prevNumber = (int) substr($nextId["id"], 1, strlen($nextId["id"])-1);
    $newNumber = $prevNumber + 1;
    $newId = "P" . $newNumber;

    $listData["nextId"] = $newId;
    file_put_contents($listDataFile, json_encode($listData));
}


<?php
session_start();
header("Content-Type: text/html");
libxml_use_internal_errors(true);

$jsonData = file_get_contents('php://input');
file_put_contents("../data/test.json", $jsonData);

// I'll probably need these everywhere, lol
$data = json_decode($jsonData, true);
$listData = null;

$listDataFile = "../data/lists.json";
if (file_exists($listDataFile)) {
    $listData = json_decode(file_get_contents($listDataFile), true);
}

if ($data["type"] == "createList") {
    $listData[$data["listId"]] = array(
        "id"=>$data["listId"],
        "name"=>$data["listName"],
        "creator"=>$_SESSION["userInfo"]["email"],
        "members"=>array($_SESSION["userInfo"]["email"]),
        "items"=>array()
    );

    file_put_contents($listDataFile, json_encode($listData, JSON_PRETTY_PRINT));
} else if ($data["type"] == "addTask") {
    $listData[$data["listId"]]["items"][$data["task"]] = false;

    file_put_contents($listDataFile, json_encode($listData, JSON_PRETTY_PRINT));
} else if ($data["type"] == "toggleTask") {
    $listData[$data["listId"]]["items"][$data["task"]] = !$listData[$data["listId"]]["items"][$data["task"]];

    file_put_contents($listDataFile, json_encode($listData, JSON_PRETTY_PRINT));
}
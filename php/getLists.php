<?php
session_start();
header("Content-Type: text/html");
libxml_use_internal_errors(true);

$listDataFile = "../data/lists.json";
$listData = null;
$userLists = array();
$currentUser = $_SESSION["userInfo"]["email"];

if (file_exists($listDataFile)) {
    $listData = json_decode(file_get_contents($listDataFile), true);
    foreach ($listData as $id=>$list) {
        if ($id !== "nextId") {
            if ($list["creator"] == $currentUser || in_array($currentUser, $list["members"])) {
                array_push($userLists, $list);
            }
        }
    }

    $returnData = array(
        "lists"=>$userLists
    );

    header("Content-Type: application/json");
    echo json_encode($returnData);
}
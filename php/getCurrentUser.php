<?php
session_start();
header("Content-Type: text/html");
libxml_use_internal_errors(true);

$currentUser = $_SESSION["userInfo"]["email"];

$returnData = array(
    "user"=>$currentUser
);

header("Content-Type: application/json");
echo json_encode($returnData);
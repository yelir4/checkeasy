<?php
session_start();
header("Content-Type: text/html");
libxml_use_internal_errors(true);

// Get user data
$userDataFile = "../data/users.json";

if (file_exists($userDataFile)) {
    $userData = json_decode(file_get_contents($userDataFile), true);
    $allUsers = array(
        "users"=>array_keys($userData)
    );

    header("Content-Type: application/json");
    echo json_encode($allUsers);
}
<?php
session_start();
header('Content-type: application/json');
require_once __DIR__ . '/dataLayer.php';
$action = $_POST["action"];

switch ($action) {
    case "login":
        Login();
    break;
    case "register":
        Register();
    break;
}

function Register(){
    $fName = $_POST["fName"];
    $lName = $_POST["lName"];
    $username = $_POST["uName"];
    $uPassword = $_POST["uPassword"];
    $uEmail = $_POST["uEmail"];
    $uGenero = $_POST["uGenero"];
    $uCountry = $_POST["uCountry"];
    $do = doEncryptRegister($username,$uPassword,$fName,$lName,$uEmail,$uGenero,$uCountry);
    if($do["status"] == "Work"){
        $result = array("message" => "Thank you! Your registration was sucessfull");
        echo json_encode($result);
    }else{
        header('HTTP/1.1 500' . $do["status"]);
        die($do["status"]);
    }
}

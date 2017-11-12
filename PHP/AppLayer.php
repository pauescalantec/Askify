<?php
session_start();
header('Content-type: application/json');
require_once __DIR__ . '/DataLayer.php';
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
    $uName = $_POST["uName"];
    $uPass = $_POST["uPass"];
    $fName = $_POST["fName"];
    $lName = $_POST["lName"];
    $uEmail = $_POST["uEmail"];
    $uMajor = $_POST["uMajor"];
    $uGradYear = $_POST["uGradYear"];
    $do = doRegister($uName,$uPass,$fName,$lName,$uEmail,$uMajor,$uGradYear);
    if($do["status"] == "Work"){
        $result = array("message" => "Thank you! Your registration was sucessfull");
        echo json_encode($result);
    }else{
        header('HTTP/1.1 500' . $do["status"]);
        die($do["status"]);
    }
}

function Login(){

    $username = $_POST["uName"];
    $pass = $_POST["uPassword"];
    $rememberMe = $_POST["rememberMe"];

    $do = doLogin($username,$pass);

    if($do["status"] == "Work"){
        if($rememberMe){
            setcookie("cookieuName", $username,time() + (86400 * 30), "/","",0);
        }
        $result = array("message" => "Login Sucessfull");
        echo json_encode($result);
    }else{
        header('HTTP/1.1 500' . $do["status"]);
        die($do["status"]);
    }
}
